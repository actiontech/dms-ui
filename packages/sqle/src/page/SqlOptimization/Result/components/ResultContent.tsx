import { useEffect, useState, useMemo } from 'react';
import { Space, Col } from 'antd';
import { SQLRenderer, BasicButton } from '@actiontech/shared';
import { useDispatch } from 'react-redux';
import {
  SqlOptimizationResultContainerWrapper,
  SqlOptimizationCardWrapper,
  SqlOptimizationRightContentWrapper
} from '../style';
import {
  TransferFilled,
  MagnifierFilled,
  FullScreenOutlined
} from '@actiontech/icons';
import ProbabilityDisplay from '../ProbabilityDisplay';
import OptimizeSteps from './OptimizeSteps';
import AnalysisChart from './AnalysisChart';
import SqlDiffModal from '../Modal/SqlDiffModal';
import TableStructureModal from '../Modal/TableStructureModal';
import OptimizationResultModal from '../Modal/OptimizationResultModal';
import QueryPlanFlow from './QueryPlanFlow';
import QueryPlanFlowModal from '../Modal/QueryPlanFlowModal';
import QueryPlanDiffModal from '../Modal/QueryPlanDiffModal';
import { ModalName } from '../../../../data/ModalName';
import {
  updateSqlOptimizationModalStatus,
  updateDiffModalData,
  updateTableStructureModalData,
  updateOptimizationResultModalData,
  updateQueryPlanFlowModalData,
  updateQueryPlanDiffModalData,
  initSqlOptimizationModalStatus
} from '../../../../store/sqlOptimization';
import { mockData } from '../data';
import { useTranslation } from 'react-i18next';
import { OptimizationResultStatus } from '../index.data';
import CopyButton from './CopyButton';
import { IOptimizationSQLDetail } from '@actiontech/shared/lib/api/sqle/service/common';

interface SqlOptimizationResultProps {
  isVerticalLayout?: boolean;
}

const SqlOptimizationResult: React.FC<SqlOptimizationResultProps> = ({
  isVerticalLayout = false
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // 索引优化建议
  const [advisedIndex, setAdvisedIndex] = useState('');

  const [optimizationResult] = useState<IOptimizationSQLDetail>(
    mockData.data ?? {}
  );

  const [optimizationResultStatus] = useState<OptimizationResultStatus>(
    OptimizationResultStatus.RESOLVED
  );

  const optimizedSql = useMemo(() => {
    const steps = optimizationResult?.optimize?.steps;
    if (!!steps && steps?.length > 0) {
      return steps?.[steps.length - 1].optimized_sql;
    }
    return optimizationResult.origin_sql;
  }, [optimizationResult]);

  // 获取优化后的执行计划
  const optimizedQueryPlan = useMemo(() => {
    const steps = optimizationResult?.optimize?.steps;
    if (!!steps && steps?.length > 0) {
      return steps[steps.length - 1].query_plan?.query_plan_desc;
    }
    return optimizationResult?.origin_query_plan?.query_plan_desc;
  }, [optimizationResult]);

  // 查看总体差异
  const handleViewOverallDiff = () => {
    dispatch(
      updateDiffModalData({
        diffData: {
          originalSql: optimizationResult.origin_sql ?? '',
          optimizedSql: optimizedSql ?? ''
        }
      })
    );
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Diff_Modal,
        status: true
      })
    );
  };

  // 查看表结构和最佳索引
  const handleViewTableStructure = () => {
    dispatch(
      updateTableStructureModalData({
        tableData: {
          tableStructure: optimizationResult.metadata ?? '',
          recommendedIndexes: advisedIndex
        }
      })
    );
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Table_Structure_Modal,
        status: true
      })
    );
  };

  // 查看优化结果详情
  const handleViewOptimizationResult = (stepIndex: number) => {
    const step = optimizationResult?.optimize?.steps?.[stepIndex];
    const prevSql =
      stepIndex === 0
        ? optimizationResult.origin_sql
        : optimizationResult?.optimize?.steps?.[stepIndex - 1].optimized_sql;

    dispatch(
      updateOptimizationResultModalData({
        resultData: {
          ...step,
          origin_sql: prevSql
        }
      })
    );
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Result_Modal,
        status: true
      })
    );
  };

  // 展开查看执行计划详情
  const handleExpandQueryPlan = () => {
    dispatch(
      updateQueryPlanFlowModalData({
        queryPlanData:
          optimizationResult?.origin_query_plan?.query_plan_desc ?? []
      })
    );
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Query_Plan_Flow_Modal,
        status: true
      })
    );
  };

  // 查看执行计划差异
  const handleViewQueryPlanDiff = () => {
    dispatch(
      updateQueryPlanDiffModalData({
        queryPlanDiffData: {
          originalQueryPlan:
            optimizationResult?.origin_query_plan?.query_plan_desc ?? [],
          optimizedQueryPlan: optimizedQueryPlan ?? []
        }
      })
    );
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Query_Plan_Diff_Modal,
        status: true
      })
    );
  };

  useEffect(() => {
    // 初始化Modal状态
    dispatch(
      initSqlOptimizationModalStatus({
        modalStatus: {
          [ModalName.Sql_Optimization_Diff_Modal]: false,
          [ModalName.Sql_Optimization_Table_Structure_Modal]: false,
          [ModalName.Sql_Optimization_Result_Modal]: false,
          [ModalName.Sql_Optimization_Query_Plan_Flow_Modal]: false,
          [ModalName.Sql_Optimization_Query_Plan_Diff_Modal]: false
        }
      })
    );

    setAdvisedIndex(
      optimizationResult?.advised_index?.indexes
        ?.map(
          (item) =>
            `/* ${item.reason ?? ''} */\n${
              item.create_index_statement ?? ''
            }\n\n`
        )
        .join('')
        .trim() ?? ''
    );
  }, [dispatch, optimizationResult]);

  return (
    <SqlOptimizationResultContainerWrapper gutter={24}>
      {/* 左侧内容 */}
      <Col span={isVerticalLayout ? 24 : 16}>
        {/* SQL优化动力 */}
        <Space direction="vertical" size={16}>
          <SqlOptimizationCardWrapper
            title={t('sqlOptimization.result.newOptimizedQuery')}
            className="sql-optimization-card"
            extra={
              <Space>
                <BasicButton
                  icon={<TransferFilled />}
                  size="small"
                  onClick={handleViewOverallDiff}
                >
                  {t('sqlOptimization.result.viewDifference')}
                </BasicButton>
                <CopyButton content={optimizedSql} />
              </Space>
            }
            bordered={false}
            size="small"
          >
            <SQLRenderer wordWrap showLineNumbers sql={optimizedSql} />
          </SqlOptimizationCardWrapper>

          {/* 索引优化建议 */}
          <SqlOptimizationCardWrapper
            title={t('sqlOptimization.result.indexOptimizationAdvice')}
            size="small"
            className="sql-optimization-card"
            bordered={false}
            extra={
              <Space>
                <BasicButton
                  icon={<MagnifierFilled />}
                  size="small"
                  onClick={handleViewTableStructure}
                >
                  {t('sqlOptimization.result.viewTableStructure')}
                </BasicButton>
                <CopyButton content={advisedIndex} />
              </Space>
            }
          >
            <SQLRenderer wordWrap showLineNumbers sql={advisedIndex} />
          </SqlOptimizationCardWrapper>

          {/* 优化后的执行计划 */}
          <SqlOptimizationCardWrapper
            title={t('sqlOptimization.result.optimizedExecutionPlan')}
            size="small"
            className="sql-optimization-card execution-plan-flow-card"
            bordered={false}
            extra={
              <Space>
                <BasicButton
                  icon={<TransferFilled />}
                  size="small"
                  onClick={handleViewQueryPlanDiff}
                >
                  {t('sqlOptimization.result.viewDifference')}
                </BasicButton>
                <BasicButton
                  icon={<FullScreenOutlined />}
                  size="small"
                  onClick={handleExpandQueryPlan}
                >
                  {t('sqlOptimization.result.expand')}
                </BasicButton>
              </Space>
            }
          >
            <QueryPlanFlow
              queryPlanDesc={optimizedQueryPlan ?? []}
              height={300}
            />
          </SqlOptimizationCardWrapper>
        </Space>
      </Col>

      {/* 右侧内容 */}
      <SqlOptimizationRightContentWrapper span={isVerticalLayout ? 24 : 8}>
        <Space direction="vertical" size={16}>
          <ProbabilityDisplay
            analysis={optimizationResult.total_analysis}
            resultStatus={optimizationResultStatus}
          />
          <div className="analysis-chart">
            <AnalysisChart data={optimizationResult.total_analysis} />
          </div>
          <OptimizeSteps
            optimizeSteps={optimizationResult?.optimize?.steps ?? []}
            onOptimizationRuleClick={handleViewOptimizationResult}
          />
        </Space>
      </SqlOptimizationRightContentWrapper>

      {/* SQL差异查看弹窗 */}
      <SqlDiffModal />

      {/* 表结构和最佳索引弹窗 */}
      <TableStructureModal />

      {/* 优化结果详情弹窗 */}
      <OptimizationResultModal />

      {/* 查询执行计划详情弹窗 */}
      <QueryPlanFlowModal />

      {/* 执行计划差异弹窗 */}
      <QueryPlanDiffModal />
    </SqlOptimizationResultContainerWrapper>
  );
};

export default SqlOptimizationResult;
