import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import useDataExportDetailReduxManage from '../../../hooks/index.redux';
import { OverviewListAction, OverviewListColumn } from './column';
import { IGetDataExportTask } from '@actiontech/shared/lib/api/base/service/common';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useBoolean } from 'ahooks';

const OverviewList: React.FC = () => {
  const { taskInfos, updateCurTaskID } = useDataExportDetailReduxManage();
  const { projectID } = useCurrentProject();

  const [
    downloadLoading,
    { setFalse: finishDownload, setTrue: startDownload }
  ] = useBoolean(false);
  const downloadAction = (taskID: string) => {
    startDownload();
    dms
      .DownloadDataExportTask(
        {
          project_uid: projectID,
          data_export_task_uid: taskID
        },
        { responseType: 'blob' }
      )
      .finally(() => {
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
      actions={OverviewListAction(downloadLoading, downloadAction)}
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
