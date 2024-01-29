import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useParams } from 'react-router-dom';
import useDataExportDetailReduxManage from './index.redux';
import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const useInitDataWithRequest = () => {
  const { workflowID } = useParams<{ workflowID: string }>();
  const { projectID } = useCurrentProject();
  const {
    updateTaskInfos,
    updateWorkflowInfo,
    workflowInfo,
    updateTaskStatusNumber
  } = useDataExportDetailReduxManage();

  const { refresh: refreshWorkflow, loading: getWorkflowLoading } = useRequest(
    () =>
      dms
        .GetDataExportWorkflow({
          project_uid: projectID,
          data_export_workflow_uid: workflowID ?? ''
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS && res.data.data) {
            updateWorkflowInfo(res.data.data);
          }
        })
  );

  const { loading: getTaskInfosLoading } = useRequest(
    () =>
      dms
        .BatchGetDataExportTask({
          project_uid: projectID,
          data_export_task_uids:
            workflowInfo?.workflow_record?.tasks
              ?.map((v) => v.task_uid ?? '')
              ?.join(',') ?? ''
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const list = res.data.data ?? [];
            updateTaskInfos(list);

            // const canRejectWorkflow = list.every(
            //   (v) =>
            //     !!v.status &&
            //     ![
            //       GetDataExportTaskStatusEnum.finish,
            //       GetDataExportTaskStatusEnum.exporting,
            //       GetDataExportTaskStatusEnum.failed
            //     ].includes(v.status)
            // );

            // updateCanRejectWorkflow(canRejectWorkflow);
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
      ready: !!workflowInfo,
      refreshDeps: [workflowInfo]
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