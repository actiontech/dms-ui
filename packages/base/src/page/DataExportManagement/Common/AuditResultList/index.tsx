import { BasicSegmented } from '@actiontech/shared';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import AuditResultTable from './Table';
import { useState } from 'react';
import { AuditResultListProps } from './index.type';
import { AuditResultStyleWrapper } from './style';
import { useRequest } from 'ahooks';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IGetDataExportTask } from '@actiontech/shared/lib/api/base/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const AuditResultList: React.FC<AuditResultListProps> = ({
  taskIDs,
  projectID
}) => {
  const [tasks, setTasks] = useState<IGetDataExportTask[]>([]);

  const [currentTaskID, setCurrentTaskID] = useState<string>();

  const handleChangeCurrentTask = (taskID?: string) => {
    setCurrentTaskID(taskID);
  };

  useRequest(
    () =>
      dms
        .BatchGetDataExportTask({
          project_uid: projectID,
          data_export_task_uids: taskIDs?.join(',') ?? ''
        })
        .then((res) => {
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
            label: v.db_info?.name,
            value: !!v?.task_uid ? `${v.task_uid}` : '',
            key: v.task_uid
          }))}
        />
      </SegmentedRowStyleWrapper>

      <AuditResultTable taskID={currentTaskID} projectID={projectID} />
    </AuditResultStyleWrapper>
  );
};

export default AuditResultList;
