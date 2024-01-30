import { IListDataExportWorkflow } from '@actiontech/shared/lib/api/base/service/common';
import { ListDataExportWorkflowStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const DataExportWorkflowList: IListDataExportWorkflow[] = [
  {
    project_uid: '700300',
    workflow_uid: '1752172808714063872',
    workflow_name: 'mysql-1_20240130113114',
    desc: 'desc',
    creater: {
      uid: '700200',
      name: 'admin'
    },
    created_at: '2024-01-30T11:32:06.053+08:00',
    exported_at: '2024-01-30T11:33:06.053+08:00',
    status: ListDataExportWorkflowStatusEnum.finish,
    current_step_assignee_user_list: [],
    current_step_type: ''
  }
];
