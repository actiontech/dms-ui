import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SqlDiffModal from './SqlDiffModal';
import TableStructureModal from './TableStructureModal';
import OptimizationResultModal from './OptimizationResultModal';
import QueryPlanFlowModal from './QueryPlanFlowModal';
import QueryPlanDiffModal from './QueryPlanDiffModal';
import { ModalName } from '../../../../data/ModalName';
import { initSqlOptimizationModalStatus } from '../../../../store/sqlOptimization';

const SqlOptimizationModals: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
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
  }, [dispatch]);

  return (
    <>
      <SqlDiffModal />

      <TableStructureModal />

      <OptimizationResultModal />

      <QueryPlanFlowModal />

      <QueryPlanDiffModal />
    </>
  );
};

export default SqlOptimizationModals;
