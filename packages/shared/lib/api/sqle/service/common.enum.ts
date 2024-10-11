export enum AssociateWorkflowsStatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'executing' = 'executing',

  'finished' = 'finished'
}

export enum AuditPlanParamResV1TypeEnum {
  'string' = 'string',

  'int' = 'int',

  'bool' = 'bool',

  'password' = 'password'
}

export enum AuditPlanReportResV1AuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error',

  'UNKNOWN' = ''
}

export enum AuditPlanSQLHeadV1TypeEnum {
  'sql' = 'sql'
}

export enum AuditPlanTypesV1InstanceTypeEnum {
  'MySQL' = 'MySQL',

  'Oracle' = 'Oracle',

  'TiDB' = 'TiDB',

  'OceanBase For MySQL' = 'OceanBase For MySQL',

  'UNKNOWN' = ''
}

export enum AuditResDataV1AuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error',

  'UNKNOWN' = ''
}

export enum AuditTaskResV1AuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error',

  'UNKNOWN' = ''
}

export enum AuditTaskResV1SqlSourceEnum {
  'form_data' = 'form_data',

  'sql_file' = 'sql_file',

  'mybatis_xml_file' = 'mybatis_xml_file',

  'audit_plan' = 'audit_plan',

  'zip_file' = 'zip_file',

  'git_repository' = 'git_repository'
}

export enum AuditTaskResV1StatusEnum {
  'initialized' = 'initialized',

  'audited' = 'audited',

  'executing' = 'executing',

  'exec_success' = 'exec_success',

  'exec_failed' = 'exec_failed',

  'manually_executed' = 'manually_executed'
}

export enum BatchUpdateSqlManageReqPriorityEnum {
  'UNKNOWN' = '',

  'high' = 'high'
}

export enum BatchUpdateSqlManageReqStatusEnum {
  'solved' = 'solved',

  'ignored' = 'ignored',

  'manual_audited' = 'manual_audited'
}

export enum BlacklistResV1TypeEnum {
  'sql' = 'sql',

  'fp_sql' = 'fp_sql',

  'ip' = 'ip',

  'cidr' = 'cidr',

  'host' = 'host',

  'instance' = 'instance'
}

export enum CreateAuditTaskReqV1ExecModeEnum {
  'sql_file' = 'sql_file',

  'sqls' = 'sqls'
}

export enum CreateAuditTasksGroupReqV1ExecModeEnum {
  'sql_file' = 'sql_file',

  'sqls' = 'sqls'
}

export enum CreateAuditWhitelistReqV1MatchTypeEnum {
  'exact_match' = 'exact_match',

  'fp_match' = 'fp_match'
}

export enum CreateBlacklistReqV1TypeEnum {
  'sql' = 'sql',

  'fp_sql' = 'fp_sql',

  'ip' = 'ip',

  'cidr' = 'cidr',

  'host' = 'host',

  'instance' = 'instance'
}

export enum CreateCustomRuleReqV1LevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum CustomRuleResV1LevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum DirectAuditFileReqV1SqlTypeEnum {
  'sql' = 'sql',

  'mybatis' = 'mybatis',

  'UNKNOWN' = ''
}

export enum DirectAuditReqV1SqlTypeEnum {
  'sql' = 'sql',

  'mybatis' = 'mybatis',

  'UNKNOWN' = ''
}

export enum FilterMetaFilterInputTypeEnum {
  'int' = 'int',

  'string' = 'string',

  'date_time' = 'date_time'
}

export enum FilterMetaFilterOpTypeEnum {
  'equal' = 'equal',

  'between' = 'between'
}

export enum GetWorkflowTasksItemV1StatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'exec_scheduled' = 'exec_scheduled',

  'exec_failed' = 'exec_failed',

  'exec_succeeded' = 'exec_succeeded',

  'executing' = 'executing',

  'manually_executed' = 'manually_executed'
}

export enum HighPriorityConditionTypeEnum {
  'string' = 'string',

  'int' = 'int',

  'bool' = 'bool',

  'password' = 'password'
}

export enum HighPriorityConditionReqOperatorEnum {
  '>' = '>',

  '=' = '=',

  '<' = '<'
}

export enum HighPriorityConditionResV1TypeEnum {
  'string' = 'string',

  'int' = 'int',

  'bool' = 'bool',

  'password' = 'password'
}

export enum InstanceAuditPlanInfoActiveStatusEnum {
  'normal' = 'normal',

  'disabled' = 'disabled'
}

export enum InstanceAuditPlanResV1ActiveStatusEnum {
  'normal' = 'normal',

  'disabled' = 'disabled'
}

export enum OperationRecordListStatusEnum {
  'succeeded' = 'succeeded',

  'failed' = 'failed'
}

export enum RecordSourceNameEnum {
  'ide_plugin' = 'ide_plugin'
}

export enum ReportPushConfigListPushUserTypeEnum {
  'fixed' = 'fixed',

  'permission_match' = 'permission_match'
}

export enum ReportPushConfigListTriggerTypeEnum {
  'immediately' = 'immediately',

  'timing' = 'timing'
}

export enum RuleParamResV1TypeEnum {
  'string' = 'string',

  'int' = 'int',

  'bool' = 'bool'
}

export enum RuleResV1LevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum SQLQueryConfigResV1AllowQueryWhenLessThanAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum ScheduleTaskDefaultOptionDefaultSelectorEnum {
  'wechat' = 'wechat',

  'feishu' = 'feishu'
}

export enum SqlManageAuditStatusEnum {
  'being_audited' = 'being_audited'
}

export enum SqlManageStatusEnum {
  'unhandled' = 'unhandled',

  'solved' = 'solved',

  'ignored' = 'ignored',

  'manual_audited' = 'manual_audited'
}

export enum SqlVersionDetailResV1StatusEnum {
  'is_being_released' = 'is_being_released',

  'locked' = 'locked'
}

export enum SqlVersionResV1StatusEnum {
  'is_being_released' = 'is_being_released',

  'locked' = 'locked'
}

export enum TestFeishuConfigurationReqV1AccountTypeEnum {
  'email' = 'email',

  'phone' = 'phone'
}

export enum UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum UpdateAuditPlanStatusReqV1ActiveEnum {
  'normal' = 'normal',

  'disabled' = 'disabled'
}

export enum UpdateAuditWhitelistReqV1MatchTypeEnum {
  'exact_match' = 'exact_match',

  'fp_match' = 'fp_match'
}

export enum UpdateBlacklistReqV1TypeEnum {
  'sql' = 'sql',

  'fp_sql' = 'fp_sql',

  'ip' = 'ip',

  'cidr' = 'cidr',

  'host' = 'host',

  'instance' = 'instance'
}

export enum UpdateCustomRuleReqV1LevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum UpdateInstanceAuditPlanStatusReqV1ActiveEnum {
  'normal' = 'normal',

  'disabled' = 'disabled'
}

export enum UpdateReportPushConfigReqV1PushUserTypeEnum {
  'fixed' = 'fixed',

  'permission_match' = 'permission_match'
}

export enum UpdateReportPushConfigReqV1TriggerTypeEnum {
  'immediately' = 'immediately',

  'timing' = 'timing'
}

export enum UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum WorkFlowStepTemplateReqV1TypeEnum {
  'sql_review' = 'sql_review',

  'sql_execute' = 'sql_execute'
}

export enum WorkflowDetailResV1CurrentStepTypeEnum {
  'sql_review' = 'sql_review',

  'sql_execute' = 'sql_execute'
}

export enum WorkflowDetailResV1StatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'executing' = 'executing',

  'finished' = 'finished'
}

export enum WorkflowDetailWithInstanceStatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'executing' = 'executing',

  'finished' = 'finished'
}

export enum WorkflowDetailWithInstanceWorkflowReleaseStatusEnum {
  'wait_for_release' = 'wait_for_release',

  'released' = 'released',

  'not_need_release' = 'not_need_release'
}

export enum WorkflowRecordResV1StatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'executing' = 'executing',

  'finished' = 'finished'
}

export enum WorkflowResV1ModeEnum {
  'same_sqls' = 'same_sqls',

  'different_sqls' = 'different_sqls'
}

export enum WorkflowStepResV1StateEnum {
  'initialized' = 'initialized',

  'approved' = 'approved',

  'rejected' = 'rejected'
}

export enum WorkflowStepResV1TypeEnum {
  'create_workflow' = 'create_workflow',

  'update_workflow' = 'update_workflow',

  'sql_review' = 'sql_review',

  'sql_execute' = 'sql_execute'
}

export enum WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum pipelineNodeBaseAuditMethodEnum {
  'offline' = 'offline',

  'online' = 'online'
}

export enum pipelineNodeBaseObjectTypeEnum {
  'sql' = 'sql',

  'mybatis' = 'mybatis'
}

export enum pipelineNodeBaseTypeEnum {
  'audit' = 'audit',

  'release' = 'release'
}

export enum pipelineNodeDetailAuditMethodEnum {
  'offline' = 'offline',

  'online' = 'online'
}

export enum pipelineNodeDetailObjectTypeEnum {
  'sql' = 'sql',

  'mybatis' = 'mybatis'
}

export enum pipelineNodeDetailTypeEnum {
  'audit' = 'audit',

  'release' = 'release'
}

export enum updatePipelineNodeAuditMethodEnum {
  'offline' = 'offline',

  'online' = 'online'
}

export enum updatePipelineNodeObjectTypeEnum {
  'sql' = 'sql',

  'mybatis' = 'mybatis'
}

export enum updatePipelineNodeTypeEnum {
  'audit' = 'audit',

  'release' = 'release'
}

export enum AssociatedStageWorkflowsStatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'executing' = 'executing',

  'finished' = 'finished'
}

export enum AuditResDataV2AuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error',

  'UNKNOWN' = ''
}

export enum DirectAuditFileReqV2SqlTypeEnum {
  'sql' = 'sql',

  'mybatis' = 'mybatis',

  'UNKNOWN' = ''
}

export enum DirectAuditReqV2SqlTypeEnum {
  'sql' = 'sql',

  'mybatis' = 'mybatis',

  'UNKNOWN' = ''
}

export enum GetWorkflowTasksItemV2StatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'exec_scheduled' = 'exec_scheduled',

  'exec_failed' = 'exec_failed',

  'exec_succeeded' = 'exec_succeeded',

  'executing' = 'executing',

  'manually_executed' = 'manually_executed',

  'terminating' = 'terminating',

  'terminate_succeeded' = 'terminate_succeeded',

  'terminate_failed' = 'terminate_failed'
}

export enum UpdateWorkflowScheduleReqV2NotifyTypeEnum {
  'wechat' = 'wechat',

  'feishu' = 'feishu'
}

export enum WorkflowRecordResV2StatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'executing' = 'executing',

  'finished' = 'finished'
}

export enum WorkflowResV2ExecModeEnum {
  'sql_file' = 'sql_file',

  'sqls' = 'sqls'
}

export enum WorkflowResV2ModeEnum {
  'same_sqls' = 'same_sqls',

  'different_sqls' = 'different_sqls'
}

export enum WorkflowStepResV2StateEnum {
  'initialized' = 'initialized',

  'approved' = 'approved',

  'rejected' = 'rejected'
}

export enum WorkflowStepResV2TypeEnum {
  'create_workflow' = 'create_workflow',

  'update_workflow' = 'update_workflow',

  'sql_review' = 'sql_review',

  'sql_execute' = 'sql_execute'
}
