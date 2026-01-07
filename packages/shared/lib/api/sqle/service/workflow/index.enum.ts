/* tslint:disable no-duplicate-string */

export enum getGlobalDataExportWorkflowsV1FilterStatusListEnum {
  'wait_for_approve' = 'wait_for_approve',

  'wait_for_export' = 'wait_for_export',

  'exporting' = 'exporting',

  'failed' = 'failed',

  'rejected' = 'rejected',

  'cancel' = 'cancel',

  'finish' = 'finish'
}

export enum getGlobalDataExportWorkflowsV1FilterProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low'
}

export enum getGlobalDataExportWorkflowStatisticsV1FilterStatusListEnum {
  'wait_for_approve' = 'wait_for_approve',

  'wait_for_export' = 'wait_for_export',

  'exporting' = 'exporting',

  'failed' = 'failed',

  'rejected' = 'rejected',

  'cancel' = 'cancel',

  'finish' = 'finish'
}

export enum getGlobalDataExportWorkflowStatisticsV1FilterProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low'
}

export enum getGlobalWorkflowsV1FilterStatusListEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'executing' = 'executing',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'finished' = 'finished'
}

export enum getGlobalWorkflowsV1FilterProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low'
}

export enum GetGlobalWorkflowStatisticsFilterStatusListEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'executing' = 'executing',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'finished' = 'finished'
}

export enum GetGlobalWorkflowStatisticsFilterProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low'
}

export enum getWorkflowsV1FilterStatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'executing' = 'executing',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'finished' = 'finished'
}

export enum autoCreateAndExecuteWorkflowV1ExecModeEnum {
  'sql_file' = 'sql_file',

  'sqls' = 'sqls'
}

export enum exportWorkflowV1FilterStatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'executing' = 'executing',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'finished' = 'finished'
}

export enum exportWorkflowV1ExportFormatEnum {
  'csv' = 'csv',

  'excel' = 'excel'
}

export enum GetBackupSqlListV1FilterExecStatusEnum {
  'initialized' = 'initialized',

  'doing' = 'doing',

  'succeeded' = 'succeeded',

  'failed' = 'failed',

  'manually_executed' = 'manually_executed',

  'terminating' = 'terminating',

  'terminate_succeeded' = 'terminate_succeeded',

  'terminate_failed' = 'terminate_failed',

  'execute_rollback' = 'execute_rollback'
}
