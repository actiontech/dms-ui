import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { IWorkflowDetailWithInstance } from '@actiontech/shared/lib/api/sqle/service/common';

type SqlManagementExceptionReduxState = {
  modalStatus: ModalStatus;
  stageId: number | null;
  currentStageWorkflowList: IWorkflowDetailWithInstance[] | null;
  workflowId: string | null;
};

const initialState: SqlManagementExceptionReduxState = {
  modalStatus: {},
  stageId: null,
  currentStageWorkflowList: [],
  workflowId: null
};

const versionManagement = createSlice({
  name: 'versionManagement',
  initialState,
  reducers: {
    updateSelectVersionStageId(
      state,
      { payload: { stageId } }: PayloadAction<{ stageId: number | null }>
    ) {
      state.stageId = stageId;
    },
    updateSelectVersionStageWorkflowList(
      state,
      {
        payload: { workflowList }
      }: PayloadAction<{ workflowList: IWorkflowDetailWithInstance[] | null }>
    ) {
      state.currentStageWorkflowList = workflowList;
    },
    updateSelectWorkflowId(
      state,
      { payload: { workflowId } }: PayloadAction<{ workflowId: string | null }>
    ) {
      state.workflowId = workflowId;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectVersionStageId,
  updateSelectVersionStageWorkflowList,
  updateSelectWorkflowId,
  initModalStatus: initVersionManagementModalStatus,
  updateModalStatus: updateVersionManagementModalStatus
} = versionManagement.actions;

export default versionManagement.reducer;
