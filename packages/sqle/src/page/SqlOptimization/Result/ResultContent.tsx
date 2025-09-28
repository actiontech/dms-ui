import { useEffect, useState, useMemo } from 'react';
import { Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { SqlOptimizationResultContainerWrapper } from './style';
import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';
import SqlOptimizationModals from './Modal';
import { ModalName } from '../../../data/ModalName';
import {
  updateSqlOptimizationModalStatus,
  updateDiffModalData,
  updateTableStructureModalData,
  updateOptimizationResultModalData,
  updateQueryPlanFlowModalData,
  updateQueryPlanDiffModalData
} from '../../../store/sqlOptimization';
import { SqlOptimizationResultProps } from './index.type';

const SqlOptimizationResult: React.FC<SqlOptimizationResultProps> = ({
  isVerticalLayout = false,
  optimizationResult,
  errorMessage,
  optimizationResultLoading
}) => {
  const dispatch = useDispatch();

  const [advisedIndex, setAdvisedIndex] = useState('');

  const { optimizedSql, optimizedQueryPlan } = useMemo(() => {
    const steps = optimizationResult?.optimize?.steps;
    if (!!steps && steps?.length > 0) {
      const lastStep = steps[steps.length - 1];
      return {
        optimizedSql: lastStep.optimized_sql,
        optimizedQueryPlan: lastStep.query_plan?.query_plan_desc
      };
    }
    return {
      optimizedSql: optimizationResult?.origin_sql,
      optimizedQueryPlan: optimizationResult?.origin_query_plan?.query_plan_desc
    };
  }, [optimizationResult]);

  const onViewOverallDiff = () => {
    dispatch(
      updateDiffModalData({
        diffData: {
          originalSql: optimizationResult?.origin_sql ?? '',
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

  const onViewTableStructure = () => {
    dispatch(
      updateTableStructureModalData({
        tableData: {
          tableStructure: optimizationResult?.metadata ?? '',
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

  const onViewOptimizationResult = (stepIndex: number) => {
    const step = optimizationResult?.optimize?.steps?.[stepIndex];
    const prevSql =
      stepIndex === 0
        ? optimizationResult?.origin_sql
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

  const onExpandQueryPlan = () => {
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

  const onViewQueryPlanDiff = () => {
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
  }, [optimizationResult]);

  return (
    <Spin spinning={optimizationResultLoading}>
      <SqlOptimizationResultContainerWrapper gutter={24}>
        <LeftContent
          optimizedSql={optimizedSql}
          advisedIndex={advisedIndex}
          optimizedQueryPlan={optimizedQueryPlan}
          errorMessage={errorMessage}
          onViewOverallDiff={onViewOverallDiff}
          onViewTableStructure={onViewTableStructure}
          onViewQueryPlanDiff={onViewQueryPlanDiff}
          onExpandQueryPlan={onExpandQueryPlan}
          isVerticalLayout={isVerticalLayout}
          optimizationStatus={optimizationResult?.status}
        />

        <RightContent
          isVerticalLayout={isVerticalLayout}
          totalAnalysis={optimizationResult?.total_analysis}
          optimizeSteps={optimizationResult?.optimize?.steps ?? []}
          errorMessage={errorMessage}
          onOptimizationRuleClick={onViewOptimizationResult}
          optimizationStatus={optimizationResult?.status}
        />

        <SqlOptimizationModals />
      </SqlOptimizationResultContainerWrapper>
    </Spin>
  );
};

export default SqlOptimizationResult;
