import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  ExportTaskStatusNumberType,
  clearDataExportAllDetailState,
  updateDataExportDetailCanRejectWorkflow,
  updateDataExportDetailCurTaskID,
  updateDataExportDetailTaskInfos,
  updateDataExportDetailTaskStatusNumber,
  updateDataExportDetailWorkflowInfo,
  updateDataExportDetailWorkflowRejectOpen,
  updateDataExportDetailWorkflowStepOpen
} from '../../../../store/dataExport';
import {
  IGetDataExportTask,
  IGetDataExportWorkflow
} from '@actiontech/shared/lib/api/base/service/common';

const useDataExportDetailReduxManage = () => {
  const reduxState = useSelector((state: IReduxState) => {
    return state.dataExport.detail;
  });

  const dispatch = useDispatch();

  const updateWorkflowStepOpen = useCallback(
    (open: boolean) => {
      dispatch(
        updateDataExportDetailWorkflowStepOpen({ workflowStepOpen: open })
      );
    },
    [dispatch]
  );

  const updateWorkflowRejectOpen = useCallback(
    (open: boolean) => {
      dispatch(
        updateDataExportDetailWorkflowRejectOpen({ workflowRejectOpen: open })
      );
    },
    [dispatch]
  );

  const updateWorkflowInfo = useCallback(
    (info: IGetDataExportWorkflow) => {
      dispatch(updateDataExportDetailWorkflowInfo({ workflowInfo: info }));
    },
    [dispatch]
  );

  const updateTaskInfos = useCallback(
    (infos: IGetDataExportTask[]) => {
      dispatch(updateDataExportDetailTaskInfos({ taskInfos: infos }));
    },
    [dispatch]
  );

  const updateCurTaskID = useCallback(
    (taskID: string | null) => {
      dispatch(updateDataExportDetailCurTaskID({ taskID }));
    },
    [dispatch]
  );

  const updateTaskStatusNumber = useCallback(
    (taskStatusNumber: ExportTaskStatusNumberType) => {
      dispatch(updateDataExportDetailTaskStatusNumber({ taskStatusNumber }));
    },
    [dispatch]
  );

  const updateCanRejectWorkflow = useCallback(
    (canRejectWorkflow: boolean) => {
      dispatch(updateDataExportDetailCanRejectWorkflow({ canRejectWorkflow }));
    },
    [dispatch]
  );

  const clearAllDetailState = useCallback(() => {
    dispatch(clearDataExportAllDetailState());
  }, [dispatch]);

  return {
    ...reduxState,
    updateWorkflowStepOpen,
    updateWorkflowRejectOpen,
    updateWorkflowInfo,
    updateTaskInfos,
    updateCurTaskID,
    updateTaskStatusNumber,
    updateCanRejectWorkflow,
    clearAllDetailState
  };
};

export default useDataExportDetailReduxManage;
