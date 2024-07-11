import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import useDataExportDetailReduxManage from '../../../hooks/index.redux';
import { OverviewListAction, OverviewListColumn } from './column';
import { IGetDataExportTask } from '@actiontech/shared/lib/api/base/service/common';
import DataExportTask from '@actiontech/shared/lib/api/base/service/DataExportTask';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { useBoolean } from 'ahooks';
import { useMemo } from 'react';

const OverviewList: React.FC = () => {
  const { taskInfos, updateCurTaskID, workflowInfo } =
    useDataExportDetailReduxManage();
  const { projectID } = useCurrentProject();
  const { uid } = useCurrentUser();

  const isCreateWorkflowUser = useMemo(() => {
    return uid === workflowInfo?.create_user?.uid;
  }, [uid, workflowInfo?.create_user?.uid]);

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
      onRow={(record: IGetDataExportTask) => {
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
