import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { IExportWorkflowV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { ResponseCode } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useBoolean } from 'ahooks';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ExportWorkflowButtonProps } from './index.type';
import { SqlExecWorkflowExportAction } from '../../action';

const ExportWorkflowButton: React.FC<ExportWorkflowButtonProps> = ({
  tableFilterInfo,
  filterStatus,
  searchKeyword
}) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);
  const exportWorkflow = () => {
    startExport();
    const hideLoading = messageApi.loading(
      t('execWorkflow.list.exportWorkflow.exporting')
    );

    const {
      filter_create_time_from,
      filter_create_time_to,
      filter_task_execute_start_time_from,
      filter_task_execute_start_time_to,
      filter_create_user_id,
      filter_current_step_assignee_user_id,
      filter_subject,
      filter_task_instance_id
    } = tableFilterInfo;

    const params: IExportWorkflowV1Params = {
      ...tableFilterInfo,
      project_name: projectName,
      filter_create_user_id,
      filter_current_step_assignee_user_id,
      filter_status: filterStatus,
      filter_subject,
      filter_task_instance_id,
      filter_create_time_from,
      filter_create_time_to,
      filter_task_execute_start_time_from,
      filter_task_execute_start_time_to,
      fuzzy_keyword: searchKeyword
    };

    workflow
      .exportWorkflowV1(params, { responseType: 'blob' })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('execWorkflow.list.exportWorkflow.exportSuccessTips')
          );
        }
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  };

  return (
    <>
      {messageContextHolder}
      {SqlExecWorkflowExportAction(exportWorkflow, exportButtonDisabled)}
    </>
  );
};

export default ExportWorkflowButton;
