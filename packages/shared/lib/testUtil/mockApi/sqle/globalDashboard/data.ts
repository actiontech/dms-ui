import {
  IGlobalSqlManageStatisticsV2,
  IGlobalSqlManageTaskItemV2,
  IGlobalWorkflowListData,
  IGlobalWorkflowStatisticsV2
} from '../../../../api/sqle/service/common';
import {
  GlobalSqlManageTaskItemV2StatusEnum,
  GlobalWorkflowListItemStatusEnum,
  GlobalWorkflowListItemWorkflowTypeEnum
} from '../../../../api/sqle/service/common.enum';

export const mockGlobalWorkflowStatisticsData: IGlobalWorkflowStatisticsV2 = {
  pending_for_me_count: 8,
  initiated_by_me_count: 5,
  archived_count: 12
};

export const mockGlobalWorkflowListData: IGlobalWorkflowListData = {
  has_more: false,
  next_cursor: '',
  total_nums: 2,
  workflows: [
    {
      workflow_id: 'workflow-1',
      workflow_name: 'SQL Release Workflow',
      workflow_desc: 'workflow-desc-1',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release,
      status: GlobalWorkflowListItemStatusEnum.pending_action,
      assignee: 'admin',
      created_at: '2026-04-13 10:00:00',
      instance_id: '1739531854064652288',
      instance_name: 'mysql-1',
      project_uid: '1',
      project_name: 'default',
      priority: 'high'
    },
    {
      workflow_id: 'workflow-2',
      workflow_name: 'Data Export Workflow',
      workflow_desc: 'workflow-desc-2',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.data_export,
      status: GlobalWorkflowListItemStatusEnum.completed,
      assignee: 'admin',
      created_at: '2026-04-13 12:00:00',
      instance_id: '1739531942258282496',
      instance_name: 'mysql-2',
      project_uid: '2',
      project_name: 'test',
      priority: 'medium'
    }
  ]
};

export const mockGlobalSqlManageStatisticsData: IGlobalSqlManageStatisticsV2 = {
  pending_sql_count: 16,
  optimized_this_week_count: 23
};

export const mockGlobalSqlManageTaskListData: IGlobalSqlManageTaskItemV2[] = [
  {
    sql_fingerprint: 'select * from user where id = ?',
    suggestion: 'add index',
    source: 'workflow',
    project_uid: '1',
    project_name: 'default',
    instance_id: '1739531854064652288',
    instance_name: 'mysql-1',
    avg_time: 0.14,
    count: 10,
    last_seen_at: '2026-04-13 12:10:00',
    status: GlobalSqlManageTaskItemV2StatusEnum.unhandled
  },
  {
    sql_fingerprint: 'update order set status = ? where id = ?',
    suggestion: 'rewrite sql',
    source: 'workflow',
    project_uid: '2',
    project_name: 'test',
    instance_id: '1739531942258282496',
    instance_name: 'mysql-2',
    avg_time: 0.03,
    count: 6,
    last_seen_at: '2026-04-13 12:30:00',
    status: GlobalSqlManageTaskItemV2StatusEnum.solved
  }
];
