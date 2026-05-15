import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  CreateDataExportPageEnum,
  initDataExportModalStatus,
  updateCreateDataExportFormValues,
  updateCreateDataExportPageState,
  updateCreateDataExportAuditLoading,
  updateCreateDataExportSubmitLoading,
  updateDataExportModalStatus,
  updateDataExportAuditedTaskID,
  updateDataExportCreatedWorkflowID,
  clearDataExportAllCreateState,
  CreateFormValuesType
} from '../../../../store/dataExport';
import { ModalName } from '../../../../data/ModalName';

const useCreateDataExportReduxManage = () => {
  const reduxState = useSelector((state: IReduxState) => {
    return {
      updateDataExportInfoOpen:
        state.dataExport.modalStatus[ModalName.DMS_UPDATE_EXPORT_TASK_INFO],
      ...state.dataExport.create
    };
  });

  const dispatch = useDispatch();

  const updateFormValues = useCallback(
    (formValues: CreateFormValuesType) => {
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

  const updateAuditLoading = useCallback(
    (auditLoading: boolean) => {
      dispatch(updateCreateDataExportAuditLoading({ auditLoading }));
    },
    [dispatch]
  );

  const updateSubmitLoading = useCallback(
    (submitLoading: boolean) => {
      dispatch(updateCreateDataExportSubmitLoading({ submitLoading }));
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
    ...reduxState,
    updateFormValues,
    updatePageState,
    updateAuditLoading,
    updateSubmitLoading,
    initModalStatus,
    updateModalStatus,
    updateTaskIDs,
    updateWorkflowID,
    clearAllState
  };
};

export default useCreateDataExportReduxManage;
