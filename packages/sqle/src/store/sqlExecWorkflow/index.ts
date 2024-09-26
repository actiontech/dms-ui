import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SqlAuditInfoFormFields,
  WorkflowBaseInfoFormFields
} from '../../page/SqlExecWorkflow/Create/index.type';
import { IVersionStageInstance } from '@actiontech/shared/lib/api/sqle/service/common';

type SqlExecWorkflowReduxState = {
  clonedExecWorkflowSqlAuditInfo: SqlAuditInfoFormFields | null;
  clonedExecWorkflowBaseInfo: WorkflowBaseInfoFormFields | null;
  versionFirstStageInstances: IVersionStageInstance[] | null;
};

const initialState: SqlExecWorkflowReduxState = {
  clonedExecWorkflowSqlAuditInfo: null,
  clonedExecWorkflowBaseInfo: null,
  versionFirstStageInstances: null
};
const sqlExecWorkflow = createSlice({
  name: 'sqlExecWorkflow',
  initialState,
  reducers: {
    updateClonedExecWorkflowSqlAuditInfo: (
      state,
      { payload: data }: PayloadAction<SqlAuditInfoFormFields | null>
    ) => {
      state.clonedExecWorkflowSqlAuditInfo = data;
    },
    updateClonedExecWorkflowBaseInfo: (
      state,
      { payload: data }: PayloadAction<WorkflowBaseInfoFormFields | null>
    ) => {
      state.clonedExecWorkflowBaseInfo = data;
    },
    updateVersionFirstStageInstances: (
      state,
      {
        payload: { versionFirstStageInstances }
      }: PayloadAction<{
        versionFirstStageInstances: IVersionStageInstance[] | null;
      }>
    ) => {
      state.versionFirstStageInstances = versionFirstStageInstances;
    }
  }
});
export const {
  updateClonedExecWorkflowSqlAuditInfo,
  updateClonedExecWorkflowBaseInfo,
  updateVersionFirstStageInstances
} = sqlExecWorkflow.actions;

export default sqlExecWorkflow.reducer;
