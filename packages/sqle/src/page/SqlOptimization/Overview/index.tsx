import { BasicButton, PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { SqlOptimizationOverviewUrlParams } from '../index.type';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { useRequest } from 'ahooks';
import { Spin, Col, Row, Statistic, Typography, Card } from 'antd';
import { SqlOptimizationOverviewBaseInfoStyleWrapper } from '../style';
import { DetailComStyleWrapper, HeaderSpaceTagStyleWrapper } from '../style';
import {
  IconDatabaseActive,
  IconDatabaseSchemaActive
} from '@actiontech/shared/lib/Icon/common';
import OptimizationSqlList from './OptimizationSqlList';
import { useState } from 'react';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import RecommendIndex from '../components/RecommendIndex';

const OptimizationOverview = () => {
  const { t } = useTranslation();

  const urlParams = useParams<SqlOptimizationOverviewUrlParams>();

  const { projectID, projectName } = useCurrentProject();

  const [sqlListLoading, setSqlListLoading] = useState<boolean>(false);

  const { data: optimizationRecord, loading: recordLoading } = useRequest(() =>
    sqlOptimization
      .GetOptimizationRecordReq({
        project_name: projectName,
        optimization_record_id: urlParams.optimizationId ?? ''
      })
      .then((res) => res.data.data)
  );

  return (
    <>
      <Spin spinning={recordLoading || sqlListLoading}>
        <PageHeader
          fixed
          title={
            <Link to={`/sqle/project/${projectID}/sql-optimization`}>
              <BasicButton icon={<IconLeftArrow />}>
                {t('sqlOptimization.create.returnButton')}
              </BasicButton>
            </Link>
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
                  <IconDatabaseActive />
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
                  <IconDatabaseSchemaActive />
                  <div>
                    {t('sqlOptimization.table.dbType')}：
                    {optimizationRecord?.db_type || '-'}
                  </div>
                </HeaderSpaceTagStyleWrapper>
              </div>
            </section>
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
          />
          <section className=" last-title">
            <Typography.Title level={5} className="title-wrap">
              {t('sqlOptimization.overview.recommendedIndex')}
            </Typography.Title>
            {/* <SqlOptimizationSqlBlockStyleWrapper>
              {optimizationRecord?.index_recommendations?.map((item, index) => (
                <RenderSQL sql={item} key={index} rows={1} />
              ))}
            </SqlOptimizationSqlBlockStyleWrapper> */}
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
