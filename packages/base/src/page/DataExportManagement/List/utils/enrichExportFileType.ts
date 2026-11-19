import {
  DataExportTaskService,
  DataExportWorkflowsService
} from '@actiontech/shared/lib/api/base';
import { ResponseCode } from '@actiontech/dms-kit';
import { IListDataExportWorkflowWithExtraParams } from '../index.type';

/**
 * 列表 API 不回显 export_file_type 时，按切片 §13.3 二次拉取任务并回填行级字段。
 */
export const enrichExportWorkflowListWithFileType = async (
  projectUid: string,
  list: IListDataExportWorkflowWithExtraParams[]
): Promise<IListDataExportWorkflowWithExtraParams[]> => {
  if (!projectUid || list.length === 0) {
    return list;
  }

  const workflowTaskMap = new Map<string, string[]>();

  await Promise.all(
    list.map(async (item) => {
      const workflowUid = item.workflow_uid?.trim();
      if (!workflowUid) {
        return;
      }
      try {
        const res = await DataExportWorkflowsService.GetDataExportWorkflow({
          project_uid: projectUid,
          data_export_workflow_uid: workflowUid
        });
        if (res.data.code !== ResponseCode.SUCCESS) {
          return;
        }
        const taskUids =
          res.data.data?.workflow_record?.tasks
            ?.map((task) => task.task_uid?.trim() ?? '')
            .filter((uid) => !!uid) ?? [];
        workflowTaskMap.set(workflowUid, taskUids);
      } catch {
        // 单行失败不影响列表主体展示
      }
    })
  );

  const allTaskUids = [
    ...new Set([...workflowTaskMap.values()].flat().filter(Boolean))
  ];
  if (allTaskUids.length === 0) {
    return list;
  }

  const taskTypeMap = new Map<string, string>();
  try {
    const res = await DataExportTaskService.BatchGetDataExportTask({
      project_uid: projectUid,
      data_export_task_uids: allTaskUids.join(',')
    });
    if (res.data.code === ResponseCode.SUCCESS) {
      (res.data.data ?? []).forEach((task) => {
        const taskUid = task.task_uid?.trim();
        const fileType = task.export_file_type?.trim();
        if (taskUid && fileType) {
          taskTypeMap.set(taskUid, fileType);
        }
      });
    }
  } catch {
    return list;
  }

  return list.map((item) => {
    const workflowUid = item.workflow_uid?.trim() ?? '';
    const taskUids = workflowTaskMap.get(workflowUid) ?? [];
    const types = [
      ...new Set(
        taskUids
          .map((uid) => taskTypeMap.get(uid))
          .filter((type): type is string => !!type)
      )
    ];
    return {
      ...item,
      export_file_type:
        types.length > 0 ? types.join('/') : item.export_file_type
    };
  });
};
