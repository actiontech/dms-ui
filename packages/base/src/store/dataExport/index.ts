import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import {
  BaseFormFieldsType,
  MethodFormFieldsType,
  SourceFormFieldsType
} from '../../page/DataExportManagement/Create/components/CreateTask/index.type';
import {
  IGetDataExportTask,
  IGetDataExportWorkflow
} from '@actiontech/shared/lib/api/base/service/common';

export enum CreateDataExportPageEnum {
  CREATE_TASK = 'CREATE_TASK',
  SUBMIT_WORKFLOW = 'SUBMIT_WORKFLOW',
  SUBMIT_RESULT = 'SUBMIT_RESULT'
}

export type CreateFormValuesType = {
  baseValues: BaseFormFieldsType;
  sourceValues: SourceFormFieldsType;
  methodValues: MethodFormFieldsType;
};

export type ExportTaskStatusNumberType = {
  success: number;
  failed: number;
  exporting: number;
};

type DataExportManagementReduxState = {
  modalStatus: ModalStatus;
  create: {
    formValues: CreateFormValuesType | null;
    pageState: CreateDataExportPageEnum;
    auditLoading: boolean;
    submitLoading: boolean;
    taskIDs: string[] | null;
    workflowID: string | null;
  };
  detail: {
    workflowStepOpen: boolean;
    workflowRejectOpen: boolean;
    workflowInfo: IGetDataExportWorkflow | null;
    taskInfos: IGetDataExportTask[] | null;
    curTaskID: string | null;
    taskStatusNumber: ExportTaskStatusNumberType | null;
    canRejectWorkflow: boolean;
  };
};

const initialState: DataExportManagementReduxState = {
  modalStatus: {},
  create: {
    formValues: null,
    pageState: CreateDataExportPageEnum.CREATE_TASK,
    auditLoading: false,
    submitLoading: false,
    taskIDs: null,
    workflowID: null
  },
  detail: {
    workflowStepOpen: false,
    workflowRejectOpen: false,
    workflowInfo: null,
    taskInfos: null,
    curTaskID: null,
    taskStatusNumber: null,
    canRejectWorkflow: true
  }
};

const dataExportManagement = createSlice({
  name: 'dataExportManagement',
  initialState,
  reducers: {
    updateFormValues(
      state,
      {
        payload: { formValues }
      }: PayloadAction<{ formValues: CreateFormValuesType }>
    ) {
      state.create.formValues = formValues;
    },
    updatePageState(
      state,
      {
        payload: { pageState }
      }: PayloadAction<{ pageState: CreateDataExportPageEnum }>
    ) {
      state.create.pageState = pageState;
    },
    updateAuditLoading(
      state,
      { payload: { auditLoading } }: PayloadAction<{ auditLoading: boolean }>
    ) {
      state.create.auditLoading = auditLoading;
    },
    updateSubmitLoading(
      state,
      { payload: { submitLoading } }: PayloadAction<{ submitLoading: boolean }>
    ) {
      state.create.submitLoading = submitLoading;
    },
    updateAuditedTaskID(
      state,
      { payload: { taskIDs } }: PayloadAction<{ taskIDs: string[] }>
    ) {
      state.create.taskIDs = taskIDs;
    },
    updateCreatedWorkflowID(
      state,
      { payload: { workflowID } }: PayloadAction<{ workflowID: string }>
    ) {
      state.create.workflowID = workflowID;
    },
    clearAllCreateState(state) {
      state.create = initialState.create;
    },
    updateWorkflowStepOpen(
      state,
      {
        payload: { workflowStepOpen }
      }: PayloadAction<{ workflowStepOpen: boolean }>
    ) {
      state.detail.workflowStepOpen = workflowStepOpen;
    },
    updateWorkflowRejectOpen(
      state,
      {
        payload: { workflowRejectOpen }
      }: PayloadAction<{ workflowRejectOpen: boolean }>
    ) {
      state.detail.workflowRejectOpen = workflowRejectOpen;
    },
    updateWorkflowInfo(
      state,
      {
        payload: { workflowInfo }
      }: PayloadAction<{ workflowInfo: IGetDataExportWorkflow }>
    ) {
      state.detail.workflowInfo = workflowInfo;
    },
    updateTaskInfos(
      state,
      {
        payload: { taskInfos }
      }: PayloadAction<{ taskInfos: IGetDataExportTask[] }>
    ) {
      state.detail.taskInfos = taskInfos;
    },
    updateCurTaskID(
      state,
      { payload: { taskID } }: PayloadAction<{ taskID: string | null }>
    ) {
      state.detail.curTaskID = taskID;
    },
    updateTaskStatusNumber(
      state,
      {
        payload: { taskStatusNumber }
      }: PayloadAction<{ taskStatusNumber: ExportTaskStatusNumberType }>
    ) {
      state.detail.taskStatusNumber = taskStatusNumber;
    },
    updateCanRejectWorkflow(
      state,
      {
        payload: { canRejectWorkflow }
      }: PayloadAction<{ canRejectWorkflow: boolean }>
    ) {
      state.detail.canRejectWorkflow = canRejectWorkflow;
    },
    clearAllDetailState(state) {
      state.detail = initialState.detail;
    },
    ...commonModalReducer()
  }
});

export const {
  updateFormValues: updateCreateDataExportFormValues,
  updatePageState: updateCreateDataExportPageState,
  updateAuditLoading: updateCreateDataExportAuditLoading,
  updateSubmitLoading: updateCreateDataExportSubmitLoading,
  initModalStatus: initDataExportModalStatus,
  updateModalStatus: updateDataExportModalStatus,
  updateAuditedTaskID: updateDataExportAuditedTaskID,
  updateCreatedWorkflowID: updateDataExportCreatedWorkflowID,
  clearAllCreateState: clearDataExportAllCreateState,
  updateWorkflowStepOpen: updateDataExportDetailWorkflowStepOpen,
  updateWorkflowRejectOpen: updateDataExportDetailWorkflowRejectOpen,
  updateWorkflowInfo: updateDataExportDetailWorkflowInfo,
  updateTaskInfos: updateDataExportDetailTaskInfos,
  updateCurTaskID: updateDataExportDetailCurTaskID,
  updateTaskStatusNumber: updateDataExportDetailTaskStatusNumber,
  updateCanRejectWorkflow: updateDataExportDetailCanRejectWorkflow,
  clearAllDetailState: clearDataExportAllDetailState
} = dataExportManagement.actions;

export default dataExportManagement.reducer;
