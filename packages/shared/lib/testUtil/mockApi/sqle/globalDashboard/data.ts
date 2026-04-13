import {
  IGlobalAccountStatisticsData,
  IGlobalSqlManageStatisticsV2,
  IGlobalSqlManageTaskItemV2,
  IGlobalWorkflowListData,
  IGlobalWorkflowStatisticsV2
} from '../../../../api/sqle/service/common';
import {
  GlobalAccountListItemV2StatusEnum,
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
  total_nums: 10,
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
    },
    {
      workflow_id: 'workflow-3',
      workflow_name: 'Workflow Pending Approval',
      workflow_desc: 'workflow-desc-3',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release,
      status: GlobalWorkflowListItemStatusEnum.pending_approval,
      assignee: 'approver',
      created_at: '2026-04-13 13:00:00',
      instance_id: '1739531854064652288',
      instance_name: 'mysql-1',
      project_uid: '1',
      project_name: 'default',
      priority: 'low'
    },
    {
      workflow_id: 'workflow-4',
      workflow_name: 'Workflow In Progress',
      workflow_desc: 'workflow-desc-4',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release,
      status: GlobalWorkflowListItemStatusEnum.in_progress,
      assignee: 'operator',
      created_at: '2026-04-13 14:00:00',
      instance_id: '1739531854064652288',
      instance_name: 'mysql-1',
      project_uid: '1',
      project_name: 'default',
      priority: 'high'
    },
    {
      workflow_id: 'workflow-5',
      workflow_name: 'Workflow Exporting',
      workflow_desc: 'workflow-desc-5',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.data_export,
      status: GlobalWorkflowListItemStatusEnum.exporting,
      assignee: 'exporter',
      created_at: '2026-04-13 15:00:00',
      instance_id: '1739531942258282496',
      instance_name: 'mysql-2',
      project_uid: '2',
      project_name: 'test',
      priority: 'medium'
    },
    {
      workflow_id: 'workflow-6',
      workflow_name: 'Workflow Rejected',
      workflow_desc: 'workflow-desc-6',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release,
      status: GlobalWorkflowListItemStatusEnum.rejected,
      assignee: 'reviewer',
      created_at: '2026-04-13 16:00:00',
      instance_id: '1739531854064652288',
      instance_name: 'mysql-1',
      project_uid: '1',
      project_name: 'default',
      priority: 'high'
    },
    {
      workflow_id: 'workflow-7',
      workflow_name: 'Workflow Cancelled',
      workflow_desc: 'workflow-desc-7',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release,
      status: GlobalWorkflowListItemStatusEnum.cancelled,
      assignee: 'owner',
      created_at: '2026-04-13 17:00:00',
      instance_id: '1739531854064652288',
      instance_name: 'mysql-1',
      project_uid: '1',
      project_name: 'default',
      priority: 'medium'
    },
    {
      workflow_id: 'workflow-8',
      workflow_name: 'Workflow Failed',
      workflow_desc: 'workflow-desc-8',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release,
      status: GlobalWorkflowListItemStatusEnum.failed,
      assignee: 'owner',
      created_at: '2026-04-13 18:00:00',
      instance_id: '1739531854064652288',
      instance_name: 'mysql-1',
      project_uid: '1',
      project_name: 'default',
      priority: 'low'
    },
    {
      workflow_id: 'workflow-9',
      workflow_name: 'Workflow Unknown',
      workflow_desc: 'workflow-desc-9',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release,
      status: GlobalWorkflowListItemStatusEnum.unknown,
      assignee: 'owner',
      created_at: '2026-04-13 19:00:00',
      instance_id: '1739531854064652288',
      instance_name: 'mysql-1',
      project_uid: '1',
      project_name: 'default',
      priority: 'medium'
    },
    {
      workflow_id: 'workflow-10',
      workflow_name: 'Workflow Empty Fields',
      workflow_desc: 'workflow-desc-10',
      workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release,
      status: GlobalWorkflowListItemStatusEnum.completed,
      created_at: '2026-04-13 20:00:00',
      project_uid: '1'
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
  },
  {
    sql_fingerprint: 'delete from logs where created_at < ?',
    suggestion: 'archive before delete',
    source: 'sql_manage',
    project_uid: '1',
    project_name: 'default',
    instance_id: '1739531854064652288',
    instance_name: 'mysql-1',
    avg_time: 0.01,
    count: 1,
    last_seen_at: '2026-04-12 09:00:00',
    status: GlobalSqlManageTaskItemV2StatusEnum.ignored
  },
  {
    sql_fingerprint: 'select * from t where a in (?)',
    suggestion: 'split batch query',
    source: 'workflow',
    project_uid: '2',
    project_name: 'test',
    instance_id: '1739531942258282496',
    instance_name: 'mysql-2',
    avg_time: 0.05,
    count: 3,
    last_seen_at: '2026-04-11 08:00:00',
    status: GlobalSqlManageTaskItemV2StatusEnum.manual_audited
  },
  {
    sql_fingerprint: 'insert into t values (?)',
    suggestion: 'batch insert',
    source: 'workflow',
    project_uid: '2',
    project_name: 'test',
    instance_id: '1739531942258282496',
    instance_name: 'mysql-2',
    avg_time: 0.02,
    count: 2,
    last_seen_at: '2026-04-10 07:00:00',
    status: GlobalSqlManageTaskItemV2StatusEnum.sent
  }
];

export const mockGlobalAccountStatisticsData: IGlobalAccountStatisticsData = {
  expiring_soon_count: 3,
  active_account_count: 9
};

// 当字段是枚举类型时，mock 数据应覆盖全部枚举值，避免遗漏分支
export const mockGlobalAccountListData = {
  can_manage: true,
  accounts: [
    {
      account_uid: 'account-1',
      account_name: 'app_user',
      project_uid: '1',
      project_name: 'default',
      instance_id: '1739531854064652288',
      instance_name: 'mysql-1',
      expired_time: '2026-04-20 10:00:00',
      status: GlobalAccountListItemV2StatusEnum.expiring
    },
    {
      account_uid: 'account-2',
      account_name: 'readonly_user',
      project_uid: '2',
      project_name: 'test',
      instance_id: '1739531942258282496',
      instance_name: 'mysql-2',
      expired_time: '2026-05-20 10:00:00',
      status: GlobalAccountListItemV2StatusEnum.active
    },
    {
      account_uid: 'account-3',
      account_name: 'expired_user',
      project_uid: '1',
      project_name: 'default',
      instance_id: '1739531854064652288',
      instance_name: 'mysql-1',
      expired_time: '2026-04-01 10:00:00',
      status: GlobalAccountListItemV2StatusEnum.expired
    },
    {
      account_uid: 'account-4',
      account_name: 'locked_user',
      project_uid: '2',
      project_name: 'test',
      instance_id: '1739531942258282496',
      instance_name: 'mysql-2',
      expired_time: '2026-06-01 10:00:00',
      status: GlobalAccountListItemV2StatusEnum.locked
    }
  ]
};
