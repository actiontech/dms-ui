import dms from '@actiontech/shared/lib/api/base/service/dms';
import EmitterKey from '../../../../data/EmitterKey';
import eventEmitter from '../../../../utils/EventEmitter';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';

const useExportDetailAction = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const [messageApi, messageContentHolder] = message.useMessage();

  const refreshWorkflow = () => {
    eventEmitter.emit(EmitterKey.DMS_Refresh_Export_Data_Workflow);
  };

  const [
    closeWorkflowLoading,
    { setFalse: finishCloseWorkflow, setTrue: startCloseWorkflow }
  ] = useBoolean();
  const closeWorkflow = (workflowID: string) => {
    startCloseWorkflow();
    dms
      .CancelDataExportWorkflow({
        payload: {
          data_export_workflow_uids: [workflowID]
        },
        project_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsDataExport.detail.action.close.successTips')
          );
          refreshWorkflow();
        }
      })
      .finally(() => {
        finishCloseWorkflow();
      });
  };

  const [
    approveWorkflowLoading,
    { setFalse: finishApproveWorkflow, setTrue: startApproveWorkflow }
  ] = useBoolean();

  const approveWorkflow = (workflowID: string) => {
    startApproveWorkflow();
    dms
      .ApproveDataExportWorkflow({
        data_export_workflow_uid: workflowID,
        project_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsDataExport.detail.action.approve.successTips')
          );
          refreshWorkflow();
        }
      })
      .finally(() => {
        finishApproveWorkflow();
      });
  };

  const [
    executeExportLoading,
    { setFalse: finishExecuteExport, setTrue: startExecuteExport }
  ] = useBoolean();

  const executeExport = (workflowID: string) => {
    startExecuteExport();
    dms
      .ExportDataExportWorkflow({
        data_export_workflow_uid: workflowID,
        project_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsDataExport.detail.action.execute.successTips')
          );
          refreshWorkflow();
        }
      })
      .finally(() => {
        finishExecuteExport();
      });
  };

  return {
    messageContentHolder,
    refreshWorkflow,
    closeWorkflowLoading,
    closeWorkflow,
    approveWorkflowLoading,
    approveWorkflow,
    executeExportLoading,
    executeExport
  };
};

export default useExportDetailAction;
