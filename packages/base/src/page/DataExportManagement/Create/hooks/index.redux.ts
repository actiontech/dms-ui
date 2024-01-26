import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  CreateDataExportPageEnum,
  initDataExportModalStatus,
  updateCreateDataExportFormValues,
  updateCreateDataExportPageState,
  updateCreateDataExportAuditState,
  updateCreateDataExportSubmitState,
  updateDataExportModalStatus,
  updateDataExportAuditedTaskID,
  updateDataExportCreatedWorkflowID,
  clearDataExportAllCreateState
} from '../../../../store/dataExport';
import { ModalName } from '../../../../data/ModalName';

const useCreateDataExportReduxManage = () => {
  const state = useSelector((state: IReduxState) => {
    return {
      updateDataExportInfoOpen:
        state.dataExport.modalStatus[ModalName.DMS_UPDATE_EXPORT_TASK_INFO],
      ...state.dataExport.create
    };
  });

  const dispatch = useDispatch();

  const updateFormValues = useCallback(
    (formValues: any) => {
      dispatch(updateCreateDataExportFormValues({ formValues }));
    },
    [dispatch]
  );

  const updatePageState = useCallback(
    (pageState: CreateDataExportPageEnum) => {
      dispatch(updateCreateDataExportPageState({ pageState }));
    },
    [dispatch]
  );

  const updateAuditState = useCallback(
    (auditLoading: boolean) => {
      dispatch(updateCreateDataExportAuditState({ auditLoading }));
    },
    [dispatch]
  );

  const updateSubmitState = useCallback(
    (submitLoading: boolean) => {
      dispatch(updateCreateDataExportSubmitState({ submitLoading }));
    },
    [dispatch]
  );

  const initModalStatus = useCallback(() => {
    dispatch(
      initDataExportModalStatus({
        modalStatus: {
          [ModalName.DMS_UPDATE_EXPORT_TASK_INFO]: false
        }
      })
    );
  }, [dispatch]);

  const updateModalStatus = useCallback(
    (payload: { modalName: ModalName; status: boolean }) => {
      dispatch(updateDataExportModalStatus(payload));
    },
    [dispatch]
  );

  const updateTaskIDs = useCallback(
    (taskIDs: string[]) => {
      dispatch(updateDataExportAuditedTaskID({ taskIDs }));
    },
    [dispatch]
  );

  const updateWorkflowID = useCallback(
    (workflowID: string) => {
      dispatch(updateDataExportCreatedWorkflowID({ workflowID }));
    },
    [dispatch]
  );

  const clearAllState = useCallback(() => {
    dispatch(clearDataExportAllCreateState());
  }, [dispatch]);

  return {
    ...state,
    updateFormValues,
    updatePageState,
    updateAuditState,
    updateSubmitState,
    initModalStatus,
    updateModalStatus,
    updateTaskIDs,
    updateWorkflowID,
    clearAllState
  };
};

export default useCreateDataExportReduxManage;
