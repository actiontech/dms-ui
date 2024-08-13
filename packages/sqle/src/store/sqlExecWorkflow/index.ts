import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SqlAuditInfoFormFields,
  WorkflowBaseInfoFormFields
} from '../../page/SqlExecWorkflow/Create/index.type';

type SqlExecWorkflowReduxState = {
  clonedExecWorkflowSqlAuditInfo: SqlAuditInfoFormFields | null;
  clonedExecWorkflowBaseInfo: WorkflowBaseInfoFormFields | null;
};

const initialState: SqlExecWorkflowReduxState = {
  clonedExecWorkflowSqlAuditInfo: null,
  clonedExecWorkflowBaseInfo: null
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
    }
  }
});
export const {
  updateClonedExecWorkflowSqlAuditInfo,
  updateClonedExecWorkflowBaseInfo
} = sqlExecWorkflow.actions;

export default sqlExecWorkflow.reducer;
