import DataExportTask from '@actiontech/shared/lib/api/base/service/DataExportTask';
import DataExportWorkflows from '@actiontech/shared/lib/api/base/service/DataExportWorkflows';
import { ResponseCode } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import useDataExportDetailReduxManage from './index.redux';
import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { useTypedParams } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

const useInitDataWithRequest = () => {
  const { workflowID } =
    useTypedParams<typeof ROUTE_PATHS.BASE.DATA_EXPORT.detail>();
  const { projectID } = useCurrentProject();
  const { updateTaskInfos, updateWorkflowInfo, updateTaskStatusNumber } =
    useDataExportDetailReduxManage();

  const { refresh: refreshWorkflow, loading: getWorkflowLoading } = useRequest(
    () =>
      DataExportWorkflows.GetDataExportWorkflow({
        project_uid: projectID,
        data_export_workflow_uid: workflowID ?? ''
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS && res.data.data) {
          updateWorkflowInfo(res.data.data);
          batchGetDataExportTask(
            res.data.data?.workflow_record?.tasks
              ?.map((v) => v.task_uid ?? '')
              ?.join(',') ?? ''
          );
        }
      })
  );

  const { loading: getTaskInfosLoading, run: batchGetDataExportTask } =
    useRequest(
      (taskIDs: string) =>
        DataExportTask.BatchGetDataExportTask({
          project_uid: projectID,
          data_export_task_uids: taskIDs
        }).then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const list = res.data.data ?? [];
            updateTaskInfos(list);

            let succeededNumber = 0,
              exportingNumber = 0,
              failedNumber = 0;
            list.forEach((v) => {
              if (v.status === GetDataExportTaskStatusEnum.finish) {
                succeededNumber++;
              } else if (v.status === GetDataExportTaskStatusEnum.exporting) {
                exportingNumber++;
              } else if (v.status === GetDataExportTaskStatusEnum.failed) {
                failedNumber++;
              }
            });
            updateTaskStatusNumber({
              failed: failedNumber,
              success: succeededNumber,
              exporting: exportingNumber
            });
          }
        }),
      {
        manual: true
      }
    );

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.DMS_Refresh_Export_Data_Workflow,
      refreshWorkflow
    );

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    getWorkflowLoading,
    getTaskInfosLoading
  };
};

export default useInitDataWithRequest;
