/* tslint:disable no-duplicate-string */

export enum GetGlobalAccountListV2FilterCardEnum {
  'expiring_soon' = 'expiring_soon',

  'active' = 'active'
}

export enum GetGlobalSqlManageTaskListV2FilterCardEnum {
  'pending' = 'pending',

  'optimized' = 'optimized'
}

export enum GetGlobalWorkflowListV2FilterCardEnum {
  'archived' = 'archived',

  'pending_for_me' = 'pending_for_me',

  'initiated_by_me' = 'initiated_by_me',

  'view_all' = 'view_all'
}

export enum GetGlobalWorkflowListV2WorkflowTypeEnum {
  'sql_release' = 'sql_release',

  'data_export' = 'data_export'
}

export enum GetGlobalWorkflowListV2FilterStatusEnum {
  'pending_approval' = 'pending_approval',

  'pending_action' = 'pending_action',

  'in_progress' = 'in_progress',

  'exporting' = 'exporting',

  'rejected' = 'rejected',

  'cancelled' = 'cancelled',

  'failed' = 'failed',

  'completed' = 'completed',

  'unknown' = 'unknown'
}
