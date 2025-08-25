import { BasicSegmented } from '@actiontech/dms-kit';
import { SegmentedRowStyleWrapper } from '@actiontech/dms-kit';
import AuditResultTable from './Table';
import { useState } from 'react';
import { AuditResultListProps } from './index.type';
import { AuditResultStyleWrapper } from './style';
import { useRequest } from 'ahooks';
import DataExportTask from '@actiontech/shared/lib/api/base/service/DataExportTask';
import { IGetDataExportTask } from '@actiontech/shared/lib/api/base/service/common';
import { ResponseCode } from '@actiontech/dms-kit';
import DbServiceSegmentedLabel from '../DbServiceSegmentedLabel';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
const AuditResultList: React.FC<AuditResultListProps> = ({
  taskIDs,
  projectID,
  onErrorGetDataExportTaskSqls,
  onSuccessGetDataExportTaskSqls
}) => {
  const [tasks, setTasks] = useState<IGetDataExportTask[]>([]);
  const [currentTaskID, setCurrentTaskID] = useState<string>();
  const handleChangeCurrentTask = (taskID?: string) => {
    setCurrentTaskID(taskID);
  };
  useRequest(
    () =>
      DataExportTask.BatchGetDataExportTask({
        project_uid: projectID,
        data_export_task_uids: taskIDs?.join(',') ?? ''
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setTasks(res.data.data ?? []);
          if (typeof res.data.data?.[0]?.task_uid !== 'undefined') {
            setCurrentTaskID(`${res.data.data[0].task_uid}`);
          }
        }
      }),
    {
      ready: !!taskIDs.length,
      refreshDeps: taskIDs
    }
  );
  return (
    <AuditResultStyleWrapper>
      <SegmentedRowStyleWrapper justify={'space-between'}>
        <BasicSegmented
          value={currentTaskID}
          onChange={(v) => handleChangeCurrentTask(v as string)}
          options={tasks.map((v) => ({
            label: (
              <DbServiceSegmentedLabel
                dbServiceName={v.db_info?.name ?? ''}
                auditLevel={
                  (v.audit_result
                    ?.audit_level as AuditTaskResV1AuditLevelEnum) ?? ''
                }
              />
            ),
            value: !!v?.task_uid ? `${v.task_uid}` : '',
            key: v.task_uid
          }))}
        />
      </SegmentedRowStyleWrapper>

      <AuditResultTable
        taskID={currentTaskID}
        projectID={projectID}
        onErrorGetDataExportTaskSqls={onErrorGetDataExportTaskSqls}
        onSuccessGetDataExportTaskSqls={onSuccessGetDataExportTaskSqls}
      />
    </AuditResultStyleWrapper>
  );
};
export default AuditResultList;
