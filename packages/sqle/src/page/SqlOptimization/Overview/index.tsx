import { PageHeader, EmptyBox, BasicToolTip } from '@actiontech/dms-kit';
import { ActionButton } from '@actiontech/shared';
import { useTypedParams } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { useRequest } from 'ahooks';
import { Spin, Col, Row, Statistic, Typography, Card } from 'antd';
import { SqlOptimizationOverviewBaseInfoStyleWrapper } from '../style';
import { DetailComStyleWrapper, HeaderSpaceTagStyleWrapper } from '../style';
import OptimizationSqlList from './OptimizationSqlList';
import { useState } from 'react';
import { floatToPercent } from '@actiontech/dms-kit/es/utils/Math';
import RecommendIndex from '../components/RecommendIndex';
import { SqlOptimizationStatusEnum } from '../index.data';
import {
  DatabaseSchemaFilled,
  DatabaseFilled,
  LeftArrowOutlined,
  InfoHexagonOutlined
} from '@actiontech/icons';
import useThemeStyleData from '../../../hooks/useThemeStyleData';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const OptimizationOverview = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.overview>();
  const { projectID, projectName } = useCurrentProject();
  const [sqlListLoading, setSqlListLoading] = useState<boolean>(false);
  const {
    data: optimizationRecord,
    loading: recordLoading,
    cancel
  } = useRequest(
    () =>
      sqlOptimization
        .GetOptimizationRecordReq({
          project_name: projectName,
          optimization_record_id: urlParams.optimizationId ?? ''
        })
        .then((res) => res.data.data),
    {
      pollingInterval: 1000,
      pollingErrorRetryCount: 3,
      onSuccess: (res) => {
        if (res?.status !== SqlOptimizationStatusEnum.optimizing) {
          cancel();
        }
      }
    }
  );
  return (
    <>
      <Spin
        spinning={
          recordLoading ||
          sqlListLoading ||
          optimizationRecord?.status === SqlOptimizationStatusEnum.optimizing
        }
      >
        <PageHeader
          fixed
          title={
            <ActionButton
              icon={<LeftArrowOutlined />}
              text={t('sqlOptimization.create.returnButton')}
              actionType="navigate-link"
              link={{
                to: ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.index,
                params: {
                  projectID
                }
              }}
            />
          }
        />
        <DetailComStyleWrapper>
          <section className="header-wrapper">
            <section className="header">
              <h3 className="header-cont-text">
                {optimizationRecord?.optimization_name || '-'}
              </h3>
            </section>
            <section className="tag-wrapper">
              <div className="custom-tag-item">
                <HeaderSpaceTagStyleWrapper
                  size={6}
                  className="project-name-space"
                >
                  <DatabaseFilled
                    width={18}
                    height={18}
                    color={sqleTheme.icon.execWorkFlow.databaseFilled}
                  />
                  <div>
                    {t('sqlOptimization.table.instanceName')}：
                    {optimizationRecord?.instance_name || '-'}
                  </div>
                </HeaderSpaceTagStyleWrapper>
              </div>
              <div className="custom-tag-item">
                <HeaderSpaceTagStyleWrapper
                  size={6}
                  className="database-type-space"
                >
                  <DatabaseSchemaFilled
                    width={18}
                    height={18}
                    color={sqleTheme.icon.execWorkFlow.schemaFilled}
                  />
                  <div>
                    {t('sqlOptimization.table.dbType')}：
                    {optimizationRecord?.db_type || '-'}
                  </div>
                </HeaderSpaceTagStyleWrapper>
              </div>
            </section>
            <EmptyBox
              if={
                optimizationRecord?.status === SqlOptimizationStatusEnum.failed
              }
            >
              <section className="status-wrapper">
                <div className="custom-tag-item">
                  <HeaderSpaceTagStyleWrapper
                    size={6}
                    className="database-type-space"
                  >
                    <InfoHexagonOutlined />
                    <div>{t('sqlOptimization.overview.failedStatusTips')}</div>
                  </HeaderSpaceTagStyleWrapper>
                </div>
              </section>
            </EmptyBox>
          </section>
        </DetailComStyleWrapper>
        <SqlOptimizationOverviewBaseInfoStyleWrapper>
          <Typography.Title level={5} className="title-wrap">
            {t('sqlOptimization.overview.optimizationOverview.title')}
          </Typography.Title>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t(
                    'sqlOptimization.overview.optimizationOverview.queryNumber'
                  )}
                  value={optimizationRecord?.basic_summary?.number_of_query}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t(
                    'sqlOptimization.overview.optimizationOverview.rewriteNumber'
                  )}
                  value={optimizationRecord?.basic_summary?.number_of_rewrite}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t(
                    'sqlOptimization.overview.optimizationOverview.indexNumber'
                  )}
                  value={optimizationRecord?.basic_summary?.number_of_index}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t(
                    'sqlOptimization.overview.optimizationOverview.performance'
                  )}
                  value={`${floatToPercent(
                    optimizationRecord?.basic_summary?.performance_gain ?? 0
                  )}%`}
                />
              </Card>
            </Col>
          </Row>
          <Typography.Title level={5} className="title-wrap">
            {t('sqlOptimization.overview.sqlTableTitle')}
          </Typography.Title>
          <OptimizationSqlList
            projectName={projectName}
            projectID={projectID}
            optimizationId={urlParams.optimizationId ?? ''}
            setSqlListLoading={setSqlListLoading}
            dbType={optimizationRecord?.db_type ?? ''}
            optimizationStatus={optimizationRecord?.status}
          />
          <section className="last-title">
            <Typography.Title level={5} className="title-wrap">
              <BasicToolTip
                title={t('sqlOptimization.overview.recommendedIndexTips')}
                suffixIcon
              >
                {t('sqlOptimization.overview.recommendedIndex')}
              </BasicToolTip>
            </Typography.Title>
            <RecommendIndex
              recommendations={optimizationRecord?.index_recommendations}
            />
          </section>
        </SqlOptimizationOverviewBaseInfoStyleWrapper>
      </Spin>
    </>
  );
};
export default OptimizationOverview;
