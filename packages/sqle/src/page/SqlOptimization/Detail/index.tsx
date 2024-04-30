import { PageHeader, BasicButton, EmptyBox } from '@actiontech/shared';
import { Spin, Typography, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import { SqlOptimizationDetailUrlParams } from '../index.type';
import { useBoolean, useRequest } from 'ahooks';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import {
  SqlOptimizationDetailStyleWrapper,
  SqlOptimizationSqlBlockStyleWrapper,
  TriggeredRuleStyleWrapper
} from '../style';
import CardWrapper from '../../../components/CardWrapper';
import HighlightCode from '../../../utils/HighlightCode';
import CopyIcon from '@actiontech/shared/lib/components/CopyIcon';
import RenderSQL from '../../../components/RenderSQL';
import CodeBlock from '../components/CodeBlock';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import { jsonParse } from '@actiontech/shared/lib/utils/Common';
import RecommendIndex from '../components/RecommendIndex';

const OptimizationDetail = () => {
  const { t } = useTranslation();

  const { projectID, projectName } = useCurrentProject();

  const urlParams = useParams<SqlOptimizationDetailUrlParams>();

  const [showRewriteSql, { setTrue: showRewriteSqlTrue }] = useBoolean();

  const { data: optimizationDetail, loading: recordLoading } = useRequest(
    () =>
      sqlOptimization
        .GetOptimizationReq({
          project_name: projectName,
          optimization_record_id: urlParams.optimizationId ?? '',
          number: urlParams.number ?? ''
        })
        .then((res) => res.data.data),
    {
      onSuccess: (res) => {
        if (!!res?.optimized_sql) {
          showRewriteSqlTrue();
        }
      }
    }
  );

  return (
    <>
      <Spin spinning={recordLoading}>
        <PageHeader
          fixed
          title={
            <Link
              to={`/sqle/project/${projectID}/sql-optimization/overview/${urlParams.optimizationId}`}
            >
              <BasicButton icon={<IconLeftArrow />}>
                {t('sqlOptimization.detail.returnButton')}
              </BasicButton>
            </Link>
          }
        />
        <SqlOptimizationDetailStyleWrapper>
          <Typography.Title level={5} className="title-wrap">
            {t('sqlOptimization.detail.sqlRewrite.title')}
          </Typography.Title>
          <Row justify="center" gutter={20}>
            <Col span={showRewriteSql ? 12 : 24}>
              <CardWrapper
                title={t('sqlOptimization.detail.sqlRewrite.originalSql')}
                extraNode={
                  <CopyIcon text={optimizationDetail?.original_sql ?? ''} />
                }
              >
                <pre
                  className="code-pre"
                  dangerouslySetInnerHTML={{
                    // todo RenderSQL调整后需要更换为RenderSQL
                    __html: HighlightCode.highlightSql(
                      optimizationDetail?.original_sql ?? ''
                    )
                  }}
                />
              </CardWrapper>
            </Col>
            <EmptyBox if={showRewriteSql}>
              <Col span={12}>
                <CardWrapper
                  title={t('sqlOptimization.detail.sqlRewrite.optimizedSql')}
                  extraNode={
                    <CopyIcon text={optimizationDetail?.optimized_sql ?? ''} />
                  }
                >
                  <pre
                    className="code-pre"
                    dangerouslySetInnerHTML={{
                      __html: HighlightCode.highlightSql(
                        optimizationDetail?.optimized_sql ?? ''
                      )
                    }}
                  />
                </CardWrapper>
              </Col>
            </EmptyBox>
          </Row>
          <EmptyBox
            if={
              !!optimizationDetail?.triggered_rule &&
              !!optimizationDetail?.triggered_rule?.length
            }
          >
            <section>
              <Typography.Title level={5} className="title-wrap">
                {t('sqlOptimization.detail.triggeredRule.title')}
              </Typography.Title>
              {optimizationDetail?.triggered_rule?.map((rule) => {
                const queriesStr: string[] = jsonParse(
                  rule.rewritten_queries_str ?? '[]',
                  []
                );
                return (
                  <TriggeredRuleStyleWrapper key={rule.rule_name}>
                    <Typography.Link
                      href={`/sqle/rule/knowledge/${rule.rule_name}/${urlParams.dbType}`}
                      target="_blank"
                      className="rule-name"
                    >
                      {rule.message}
                    </Typography.Link>
                    <SqlOptimizationSqlBlockStyleWrapper>
                      {queriesStr?.map((item, index) => (
                        <RenderSQL sql={item} key={index} rows={1} />
                      ))}
                    </SqlOptimizationSqlBlockStyleWrapper>
                  </TriggeredRuleStyleWrapper>
                );
              })}
            </section>
          </EmptyBox>
          <Typography.Title level={5} className="title-wrap">
            {t('sqlOptimization.detail.recommenderIndex.title')}
          </Typography.Title>
          <RecommendIndex
            recommendations={optimizationDetail?.index_recommendations}
          />
          <Typography.Title level={5} className="title-wrap">
            {t('sqlOptimization.detail.performanceValidation.performImprove')}
          </Typography.Title>
          <SqlOptimizationSqlBlockStyleWrapper>
            <Typography.Text>
              {t(
                'sqlOptimization.detail.performanceValidation.performImproveDesc'
              )}
              <Typography.Text type="success">
                {floatToPercent(
                  optimizationDetail?.explain_validation_details
                    ?.perform_improve_per ?? 0
                )}
                %
              </Typography.Text>
            </Typography.Text>
          </SqlOptimizationSqlBlockStyleWrapper>
          <EmptyBox
            if={!!optimizationDetail?.explain_validation_details?.before_plan}
          >
            <Typography.Title level={5} className="title-wrap">
              {t('sqlOptimization.detail.performanceValidation.beforePlan')}
            </Typography.Title>
            <CodeBlock
              code={
                optimizationDetail?.explain_validation_details?.before_plan ??
                ''
              }
            ></CodeBlock>
          </EmptyBox>
          <EmptyBox
            if={!!optimizationDetail?.explain_validation_details?.after_plan}
          >
            <Typography.Title level={5} className="title-wrap">
              {t('sqlOptimization.detail.performanceValidation.afterPlan')}
            </Typography.Title>
            <CodeBlock
              code={
                optimizationDetail?.explain_validation_details?.after_plan ?? ''
              }
            ></CodeBlock>
          </EmptyBox>
        </SqlOptimizationDetailStyleWrapper>
      </Spin>
    </>
  );
};

export default OptimizationDetail;
