/* tslint:disable no-duplicate-string */

export enum getAuditTaskSQLsV1FilterExecStatusEnum {
  'initialized' = 'initialized',

  'doing' = 'doing',

  'succeeded' = 'succeeded',

  'failed' = 'failed',

  'manually_executed' = 'manually_executed',

  'execute_rollback' = 'execute_rollback'
}

export enum getAuditTaskSQLsV1FilterAuditStatusEnum {
  'initialized' = 'initialized',

  'doing' = 'doing',

  'finished' = 'finished'
}

export enum getAuditTaskSQLsV1FilterAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum getAuditTaskSQLsV2FilterExecStatusEnum {
  'initialized' = 'initialized',

  'doing' = 'doing',

  'succeeded' = 'succeeded',

  'failed' = 'failed',

  'manually_executed' = 'manually_executed',

  'terminating' = 'terminating',

  'terminate_succeeded' = 'terminate_succeeded',

  'terminate_failed' = 'terminate_failed',

  'execute_rollback' = 'execute_rollback',

  /** 前序失败导致本条未跑（backend / frontend §6.3） */
  'not_executed' = 'not_executed'
}

export enum getAuditTaskSQLsV2FilterAuditStatusEnum {
  'initialized' = 'initialized',

  'doing' = 'doing',

  'finished' = 'finished'
}

export enum getAuditTaskSQLsV2FilterAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}
