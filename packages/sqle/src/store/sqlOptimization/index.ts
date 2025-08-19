import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import {
  IQueryPlanNode,
  IOptimizeStep
} from '@actiontech/shared/lib/api/sqle/service/common';

interface SqlDiffData {
  originalSql: string;
  optimizedSql: string;
}

interface TableStructureData {
  tableStructure: string;
  recommendedIndexes: string;
}

interface OptimizationResultData extends IOptimizeStep {
  origin_sql?: string;
}

interface QueryPlanDiffData {
  originalQueryPlan: IQueryPlanNode[];
  optimizedQueryPlan: IQueryPlanNode[];
}

type SqlOptimizationReduxState = {
  modalStatus: ModalStatus;
  diffModal: {
    currentDiffData: SqlDiffData | null;
  };
  tableStructureModal: {
    currentTableData: TableStructureData | null;
  };
  optimizationResultModal: {
    currentResultData: OptimizationResultData | null;
  };
  queryPlanFlowModal: {
    currentQueryPlanData: IQueryPlanNode[] | null;
  };
  queryPlanDiffModal: {
    currentQueryPlanDiffData: QueryPlanDiffData | null;
  };
};

const initialState: SqlOptimizationReduxState = {
  modalStatus: {},
  diffModal: {
    currentDiffData: null
  },
  tableStructureModal: {
    currentTableData: null
  },
  optimizationResultModal: {
    currentResultData: null
  },
  queryPlanFlowModal: {
    currentQueryPlanData: null
  },
  queryPlanDiffModal: {
    currentQueryPlanDiffData: null
  }
};

const sqlOptimization = createSlice({
  name: 'sqlOptimization',
  initialState,
  reducers: {
    updateDiffModalData(
      state,
      { payload: { diffData } }: PayloadAction<{ diffData: SqlDiffData | null }>
    ) {
      state.diffModal.currentDiffData = diffData;
    },
    updateTableStructureModalData(
      state,
      {
        payload: { tableData }
      }: PayloadAction<{ tableData: TableStructureData | null }>
    ) {
      state.tableStructureModal.currentTableData = tableData;
    },
    updateOptimizationResultModalData(
      state,
      {
        payload: { resultData }
      }: PayloadAction<{ resultData: OptimizationResultData | null }>
    ) {
      state.optimizationResultModal.currentResultData = resultData;
    },
    updateQueryPlanFlowModalData(
      state,
      {
        payload: { queryPlanData }
      }: PayloadAction<{ queryPlanData: IQueryPlanNode[] | null }>
    ) {
      state.queryPlanFlowModal.currentQueryPlanData = queryPlanData;
    },
    updateQueryPlanDiffModalData(
      state,
      {
        payload: { queryPlanDiffData }
      }: PayloadAction<{ queryPlanDiffData: QueryPlanDiffData | null }>
    ) {
      state.queryPlanDiffModal.currentQueryPlanDiffData = queryPlanDiffData;
    },
    ...commonModalReducer()
  }
});

export const {
  updateDiffModalData,
  updateTableStructureModalData,
  updateOptimizationResultModalData,
  updateQueryPlanFlowModalData,
  updateQueryPlanDiffModalData,
  initModalStatus: initSqlOptimizationModalStatus,
  updateModalStatus: updateSqlOptimizationModalStatus
} = sqlOptimization.actions;

export default sqlOptimization.reducer;
