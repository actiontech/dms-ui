import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SqlAuditInfoFormFields,
  WorkflowBaseInfoFormFields
} from '../../page/SqlExecWorkflow/Create/index.type';
import { IVersionStageInstance } from '@actiontech/shared/lib/api/sqle/service/common';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

type SqlExecWorkflowReduxState = {
  clonedExecWorkflowSqlAuditInfo: SqlAuditInfoFormFields | null;
  clonedExecWorkflowBaseInfo: WorkflowBaseInfoFormFields | null;
  versionFirstStageInstances: IVersionStageInstance[] | null;
  workflowRollbackSqlIds: number[] | null;
  retryExecuteData: {
    taskId: string;
    execSqlId?: number;
    pageIndex?: number;
    pageSize?: number;
  } | null;
  modalStatus: ModalStatus;
};

const initialState: SqlExecWorkflowReduxState = {
  clonedExecWorkflowSqlAuditInfo: null,
  clonedExecWorkflowBaseInfo: null,
  versionFirstStageInstances: null,
  workflowRollbackSqlIds: null,
  retryExecuteData: null,
  modalStatus: {}
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
    },
    updateWorkflowRollbackSqlIds: (
      state,
      {
        payload: { workflowRollbackSqlIds }
      }: PayloadAction<{
        workflowRollbackSqlIds: number[] | null;
      }>
    ) => {
      state.workflowRollbackSqlIds = workflowRollbackSqlIds;
    },
    updateRetryExecuteData: (
      state,
      {
        payload: data
      }: PayloadAction<SqlExecWorkflowReduxState['retryExecuteData']>
    ) => {
      state.retryExecuteData = data;
    },
    ...commonModalReducer()
  }
});
export const {
  updateClonedExecWorkflowSqlAuditInfo,
  updateClonedExecWorkflowBaseInfo,
  updateVersionFirstStageInstances,
  updateWorkflowRollbackSqlIds,
  updateRetryExecuteData,
  initModalStatus: initSqlExecWorkflowModalStatus,
  updateModalStatus: updateSqlExecWorkflowModalStatus
} = sqlExecWorkflow.actions;

export default sqlExecWorkflow.reducer;
