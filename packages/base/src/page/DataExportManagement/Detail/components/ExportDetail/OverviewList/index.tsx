import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import useDataExportDetailReduxManage from '../../../hooks/index.redux';
import { OverviewListAction, OverviewListColumn } from './column';
import DataExportTask from '@actiontech/shared/lib/api/base/service/DataExportTask';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/features';
import { useBoolean } from 'ahooks';
import { useMemo } from 'react';

const OverviewList: React.FC = () => {
  const { taskInfos, updateCurTaskID, workflowInfo } =
    useDataExportDetailReduxManage();
  const { projectID } = useCurrentProject();
  const { userId } = useCurrentUser();

  const isCreateWorkflowUser = useMemo(() => {
    return userId === workflowInfo?.create_user?.uid;
  }, [userId, workflowInfo?.create_user?.uid]);

  const [
    downloadLoading,
    { setFalse: finishDownload, setTrue: startDownload }
  ] = useBoolean(false);
  const downloadAction = (taskID: string) => {
    startDownload();
    DataExportTask.DownloadDataExportTask(
      {
        project_uid: projectID,
        data_export_task_uid: taskID
      },
      { responseType: 'blob' }
    ).finally(() => {
      finishDownload();
    });
  };

  return (
    <ActiontechTable
      rowKey="task_uid"
      className="table-row-cursor"
      dataSource={taskInfos ?? []}
      pagination={false}
      columns={OverviewListColumn()}
      actions={
        isCreateWorkflowUser
          ? OverviewListAction(downloadLoading, downloadAction)
          : undefined
      }
      onRow={(record) => {
        return {
          onClick() {
            updateCurTaskID(record.task_uid ?? '');
          }
        };
      }}
    />
  );
};

export default OverviewList;
