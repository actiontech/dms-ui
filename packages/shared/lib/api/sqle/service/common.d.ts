import {
  AuditPlanParamResV1TypeEnum,
  AuditPlanReportResV1AuditLevelEnum,
  AuditPlanSQLHeadV1TypeEnum,
  AuditPlanTypesV1InstanceTypeEnum,
  AuditResDataV1AuditLevelEnum,
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum,
  BatchUpdateSqlManageReqStatusEnum,
  CreateAuditWhitelistReqV1MatchTypeEnum,
  CreateCustomRuleReqV1LevelEnum,
  CustomRuleResV1LevelEnum,
  DirectAuditFileReqV1SqlTypeEnum,
  DirectAuditReqV1SqlTypeEnum,
  GetWorkflowTasksItemV1StatusEnum,
  OperationRecordListStatusEnum,
  RuleParamResV1TypeEnum,
  RuleResV1LevelEnum,
  SQLQueryConfigResV1AllowQueryWhenLessThanAuditLevelEnum,
  SourceTypeEnum,
  SqlManageStatusEnum,
  TestFeishuConfigurationReqV1AccountTypeEnum,
  UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum,
  UpdateAuditWhitelistReqV1MatchTypeEnum,
  UpdateCustomRuleReqV1LevelEnum,
  UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  WorkFlowStepTemplateReqV1TypeEnum,
  WorkflowDetailResV1CurrentStepTypeEnum,
  WorkflowDetailResV1StatusEnum,
  WorkflowRecordResV1StatusEnum,
  WorkflowResV1ModeEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
  AuditResDataV2AuditLevelEnum,
  DirectAuditFileReqV2SqlTypeEnum,
  DirectAuditReqV2SqlTypeEnum,
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ModeEnum,
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum
} from './common.enum';

export interface IBaseRes {
  code?: number;

  message?: string;
}

export interface IAuditPlanCount {
  audit_plan_count?: number;

  audit_plan_desc?: string;

  audit_plan_type?: string;
}

export interface IAuditPlanMetaV1 {
  audit_plan_params?: IAuditPlanParamResV1[];

  audit_plan_type?: string;

  audit_plan_type_desc?: string;

  instance_type?: string;
}

export interface IAuditPlanParamReqV1 {
  key?: string;

  value?: string;
}

export interface IAuditPlanParamResV1 {
  desc?: string;

  key?: string;

  type?: AuditPlanParamResV1TypeEnum;

  value?: string;
}

export interface IAuditPlanReportResV1 {
  audit_level?: AuditPlanReportResV1AuditLevelEnum;

  audit_plan_report_id?: string;

  audit_plan_report_timestamp?: string;

  pass_rate?: number;

  score?: number;
}

export interface IAuditPlanReportSQLResV1 {
  audit_plan_report_sql?: string;

  audit_plan_report_sql_audit_result?: string;

  number?: number;
}

export interface IAuditPlanResV1 {
  audit_plan_cron?: string;

  audit_plan_db_type?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_meta?: IAuditPlanMetaV1;

  audit_plan_name?: string;

  audit_plan_token?: string;

  rule_template_name?: string;
}

export interface IAuditPlanSQLHeadV1 {
  desc?: string;

  name?: string;

  type?: AuditPlanSQLHeadV1TypeEnum;
}

export interface IAuditPlanSQLReqV1 {
  audit_plan_sql_counter?: string;

  audit_plan_sql_fingerprint?: string;

  audit_plan_sql_last_receive_text?: string;

  audit_plan_sql_last_receive_timestamp?: string;

  audit_plan_sql_schema?: string;

  db_user?: string;

  first_query_at?: string;

  query_time_avg?: number;

  query_time_max?: number;
}

export interface IAuditPlanSQLResV1 {
  head?: IAuditPlanSQLHeadV1[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface IAuditPlanTypesV1 {
  desc?: string;

  instance_type?: AuditPlanTypesV1InstanceTypeEnum;

  type?: string;
}

export interface IAuditResDataV1 {
  audit_level?: AuditResDataV1AuditLevelEnum;

  pass_rate?: number;

  score?: number;

  sql_results?: IAuditSQLResV1[];
}

export interface IAuditResult {
  db_type?: string;

  level?: string;

  message?: string;

  rule_name?: string;
}

export interface IAuditSQLResV1 {
  audit_level?: string;

  audit_result?: string;

  exec_sql?: string;

  number?: number;
}

export interface IAuditTaskGroupRes {
  task_group_id?: number;

  tasks?: IAuditTaskResV1[];
}

export interface IAuditTaskGroupResV1 {
  code?: number;

  data?: IAuditTaskGroupRes;

  message?: string;
}

export interface IAuditTaskResV1 {
  audit_level?: AuditTaskResV1AuditLevelEnum;

  exec_end_time?: string;

  exec_start_time?: string;

  instance_db_type?: string;

  instance_name?: string;

  instance_schema?: string;

  pass_rate?: number;

  score?: number;

  sql_source?: AuditTaskResV1SqlSourceEnum;

  status?: AuditTaskResV1StatusEnum;

  task_id?: number;
}

export interface IAuditTaskSQLContentResV1 {
  sql?: string;
}

export interface IAuditTaskSQLResV1 {
  audit_level?: string;

  audit_result?: string;

  audit_status?: string;

  description?: string;

  exec_result?: string;

  exec_sql?: string;

  exec_status?: string;

  number?: number;

  rollback_sql?: string;
}

export interface IAuditTasksGroupResV1 {
  task_group_id?: number;
}

export interface IAuditWhitelistResV1 {
  audit_whitelist_id?: number;

  desc?: string;

  match_type?: string;

  value?: string;
}

export interface IAuditedSQLCount {
  risk_sql_count?: number;

  total_sql_count?: number;
}

export interface IBatchCancelWorkflowsReqV1 {
  workflow_names?: string[];
}

export interface IBatchCheckInstanceConnectionsReqV1 {
  instances?: IInstanceForCheckConnection[];
}

export interface IBatchCompleteWorkflowsReqV1 {
  workflow_names?: string[];
}

export interface IBatchGetInstanceConnectionsResV1 {
  code?: number;

  data?: IInstanceConnectionResV1[];

  message?: string;
}

export interface IBatchUpdateSqlManageReq {
  assignees?: string[];

  remark?: string;

  sql_manage_id_list?: number[];

  status?: BatchUpdateSqlManageReqStatusEnum;
}

export interface ICheckLicenseResV1 {
  code?: number;

  content?: string;

  license?: ILicenseItem[];

  message?: string;
}

export interface ICloneProjectRuleTemplateReqV1 {
  desc?: string;

  new_rule_template_name?: string;
}

export interface ICloneRuleTemplateReqV1 {
  desc?: string;

  new_rule_template_name?: string;
}

export interface ICreateAuditPlanReqV1 {
  audit_plan_cron?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_instance_type?: string;

  audit_plan_name?: string;

  audit_plan_params?: IAuditPlanParamReqV1[];

  audit_plan_type?: string;

  rule_template_name?: string;
}

export interface ICreateAuditTasksGroupReqV1 {
  instances?: IInstanceForCreatingTask[];
}

export interface ICreateAuditTasksGroupResV1 {
  code?: number;

  data?: IAuditTasksGroupResV1;

  message?: string;
}

export interface ICreateAuditWhitelistReqV1 {
  desc?: string;

  match_type?: CreateAuditWhitelistReqV1MatchTypeEnum;

  value?: string;
}

export interface ICreateCustomRuleReqV1 {
  annotation?: string;

  db_type?: string;

  desc?: string;

  level?: CreateCustomRuleReqV1LevelEnum;

  rule_script?: string;

  type?: string;
}

export interface ICreateProjectRuleTemplateReqV1 {
  db_type?: string;

  desc?: string;

  rule_list?: IRuleReqV1[];

  rule_template_name?: string;
}

export interface ICreateRuleTemplateReqV1 {
  db_type?: string;

  desc?: string;

  rule_list?: IRuleReqV1[];

  rule_template_name?: string;
}

export interface ICreateSQLAuditRecordResV1 {
  code?: number;

  data?: ISQLAuditRecordResData;

  message?: string;
}

export interface ICreateWorkflowReqV1 {
  desc?: string;

  task_ids?: number[];

  workflow_subject?: string;
}

export interface ICustomRuleResV1 {
  annotation?: string;

  db_type?: string;

  desc?: string;

  level?: CustomRuleResV1LevelEnum;

  rule_id?: string;

  rule_script?: string;

  type?: string;
}

export interface IDBTypeAuditPlan {
  data?: IAuditPlanCount[];

  db_type?: string;
}

export interface IDBTypeHealth {
  db_type?: string;

  health_instance_names?: string[];

  unhealth_instance_names?: string[];
}

export interface IDashboardProjectTipV1 {
  project_name?: string;

  unfinished_workflow_count?: number;
}

export interface IDashboardResV1 {
  workflow_statistics?: IWorkflowStatisticsResV1;
}

export interface IDingTalkConfigurationV1 {
  app_key?: string;

  is_enable_ding_talk_notify?: boolean;
}

export interface IDirectAuditFileReqV1 {
  file_contents?: string[];

  instance_name?: string;

  instance_type?: string;

  project_name?: string;

  schema_name?: string;

  sql_type?: DirectAuditFileReqV1SqlTypeEnum;
}

export interface IDirectAuditReqV1 {
  instance_name?: string;

  instance_type?: string;

  project_name?: string;

  schema_name?: string;

  sql_content?: string;

  sql_type?: DirectAuditReqV1SqlTypeEnum;
}

export interface IDirectAuditResV1 {
  code?: number;

  data?: IAuditResDataV1;

  message?: string;
}

export interface IDirectGetSQLAnalysisResV1 {
  code?: number;

  data?: ISqlAnalysisResDataV1[];

  message?: string;
}

export interface IDriversResV1 {
  driver_name_list?: string[];
}

export interface IExplainClassicResult {
  head?: ITableMetaItemHeadResV1[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface IFeishuConfigurationV1 {
  app_id?: string;

  is_feishu_notification_enabled?: boolean;
}

export interface IFullSyncAuditPlanSQLsReqV1 {
  audit_plan_sql_list?: IAuditPlanSQLReqV1[];
}

export interface IGetAuditPlanAnalysisDataResV1 {
  code?: number;

  data?: IGetSQLAnalysisDataResItemV1;

  message?: string;
}

export interface IGetAuditPlanMetasResV1 {
  code?: number;

  data?: IAuditPlanMetaV1[];

  message?: string;
}

export interface IGetAuditPlanNotifyConfigResDataV1 {
  enable_email_notify?: boolean;

  enable_web_hook_notify?: boolean;

  notify_interval?: number;

  notify_level?: string;

  web_hook_template?: string;

  web_hook_url?: string;
}

export interface IGetAuditPlanNotifyConfigResV1 {
  code?: number;

  data?: IGetAuditPlanNotifyConfigResDataV1;

  message?: string;
}

export interface IGetAuditPlanReportResV1 {
  code?: number;

  data?: IAuditPlanReportResV1;

  message?: string;
}

export interface IGetAuditPlanReportSQLsResV1 {
  code?: number;

  data?: IAuditPlanReportSQLResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlanReportsResV1 {
  code?: number;

  data?: IAuditPlanReportResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlanResV1 {
  code?: number;

  data?: IAuditPlanResV1;

  message?: string;
}

export interface IGetAuditPlanSQLsResV1 {
  code?: number;

  data?: IAuditPlanSQLResV1;

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlanTypesResV1 {
  code?: number;

  data?: IAuditPlanTypesV1[];

  message?: string;
}

export interface IGetAuditPlansResV1 {
  code?: number;

  data?: IAuditPlanResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditTaskResV1 {
  code?: number;

  data?: IAuditTaskResV1;

  message?: string;
}

export interface IGetAuditTaskSQLContentResV1 {
  code?: number;

  data?: IAuditTaskSQLContentResV1;

  message?: string;
}

export interface IGetAuditTaskSQLsResV1 {
  code?: number;

  data?: IAuditTaskSQLResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditWhitelistResV1 {
  code?: number;

  data?: IAuditWhitelistResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetCustomRuleResV1 {
  code?: number;

  data?: ICustomRuleResV1;

  message?: string;
}

export interface IGetCustomRulesResV1 {
  code?: number;

  data?: ICustomRuleResV1[];

  message?: string;
}

export interface IGetDashboardProjectTipsResV1 {
  code?: number;

  data?: IDashboardProjectTipV1[];

  message?: string;
}

export interface IGetDashboardResV1 {
  code?: number;

  data?: IDashboardResV1;

  message?: string;
}

export interface IGetDingTalkConfigurationResV1 {
  code?: number;

  data?: IDingTalkConfigurationV1;

  message?: string;
}

export interface IGetDriversResV1 {
  code?: number;

  data?: IDriversResV1;

  message?: string;
}

export interface IGetFeishuAuditConfigurationResV1 {
  code?: number;

  data?: IFeishuConfigurationV1;

  message?: string;
}

export interface IGetInstanceConnectableResV1 {
  code?: number;

  data?: IInstanceConnectableResV1;

  message?: string;
}

export interface IGetInstanceHealthResV1 {
  code?: number;

  data?: IDBTypeHealth[];

  message?: string;
}

export interface IGetInstanceSchemaResV1 {
  code?: number;

  data?: IInstanceSchemaResV1;

  message?: string;
}

export interface IGetInstanceTipsResV1 {
  code?: number;

  data?: IInstanceTipResV1[];

  message?: string;
}

export interface IGetInstancesTypePercentResV1 {
  code?: number;

  data?: IInstancesTypePercentV1;

  message?: string;
}

export interface IGetLicenseResV1 {
  code?: number;

  content?: string;

  license?: ILicenseItem[];

  message?: string;
}

export interface IGetLicenseUsageResV1 {
  code?: number;

  data?: ILicenseUsageV1;

  message?: string;
}

export interface IGetOperationActionListResV1 {
  code?: number;

  data?: IOperationActionList[];

  message?: string;
}

export interface IGetOperationRecordListResV1 {
  code?: number;

  data?: IOperationRecordList[];

  message?: string;

  total_nums?: number;
}

export interface IGetOperationTypeNamesListResV1 {
  code?: number;

  data?: IOperationTypeNameList[];

  message?: string;
}

export interface IGetOperationsResV1 {
  code?: number;

  data?: IOperationResV1[];

  message?: string;
}

export interface IGetProjectRuleTemplateResV1 {
  code?: number;

  data?: IRuleProjectTemplateDetailResV1;

  message?: string;
}

export interface IGetProjectRuleTemplatesResV1 {
  code?: number;

  data?: IProjectRuleTemplateResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetProjectScoreResV1 {
  code?: number;

  data?: IProjectScore;

  message?: string;
}

export interface IGetProjectStatisticsResDataV1 {
  audit_plan_total?: number;

  instance_total?: number;

  member_total?: number;

  rule_template_total?: number;

  whitelist_total?: number;

  workflow_total?: number;
}

export interface IGetProjectStatisticsResV1 {
  code?: number;

  data?: IGetProjectStatisticsResDataV1;

  message?: string;
}

export interface IGetRiskAuditPlanResV1 {
  code?: number;

  data?: IRiskAuditPlan[];

  message?: string;
}

export interface IGetRoleUserCountResV1 {
  code?: number;

  data?: IRoleUserCount[];

  message?: string;
}

export interface IGetRuleKnowledgeResV1 {
  code?: number;

  data?: IRuleKnowledgeResV1;

  message?: string;
}

export interface IGetRuleTemplateResV1 {
  code?: number;

  data?: IRuleTemplateDetailResV1;

  message?: string;
}

export interface IGetRuleTemplateTipsResV1 {
  code?: number;

  data?: IRuleTemplateTipResV1[];

  message?: string;
}

export interface IGetRuleTemplatesResV1 {
  code?: number;

  data?: IRuleTemplateResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetRuleTypeByDBTypeResV1 {
  code?: number;

  data?: IRuleTypeV1[];

  message?: string;
}

export interface IGetRulesResV1 {
  code?: number;

  data?: IRuleResV1[];

  message?: string;
}

export interface IGetSQLAnalysisDataResItemV1 {
  sql_explain?: ISQLExplain;

  table_metas?: ITableMeta[];
}

export interface IGetSQLAuditRecordResV1 {
  code?: number;

  data?: ISQLAuditRecord;

  message?: string;
}

export interface IGetSQLAuditRecordTagTipsResV1 {
  code?: number;

  data?: string[];

  message?: string;
}

export interface IGetSQLAuditRecordsResV1 {
  code?: number;

  data?: ISQLAuditRecord[];

  message?: string;

  total_nums?: number;
}

export interface IGetSQLEInfoResDataV1 {
  logo_url?: string;

  title?: string;

  version?: string;
}

export interface IGetSQLEInfoResV1 {
  code?: number;

  data?: IGetSQLEInfoResDataV1;

  message?: string;
}

export interface IGetSqlAverageExecutionTimeResV1 {
  code?: number;

  data?: ISqlAverageExecutionTime[];

  message?: string;
}

export interface IGetSqlExecutionFailPercentResV1 {
  code?: number;

  data?: ISqlExecutionFailPercent[];

  message?: string;
}

export interface IGetSqlManageListResp {
  code?: number;

  data?: ISqlManage[];

  message?: string;

  sql_manage_bad_num?: number;

  sql_manage_optimized_num?: number;

  sql_manage_total_num?: number;
}

export interface IGetSystemVariablesResV1 {
  code?: number;

  data?: ISystemVariablesResV1;

  message?: string;
}

export interface IGetTableMetadataResV1 {
  code?: number;

  data?: IInstanceTableMeta;

  message?: string;
}

export interface IGetTaskAnalysisDataResItemV1 {
  sql_explain?: ISQLExplain;

  table_metas?: ITableMeta[];
}

export interface IGetTaskAnalysisDataResV1 {
  code?: number;

  data?: IGetTaskAnalysisDataResItemV1;

  message?: string;
}

export interface IGetUserTipsResV1 {
  code?: number;

  data?: IUserTipResV1[];

  message?: string;
}

export interface IGetWorkflowAuditPassPercentResV1 {
  code?: number;

  data?: IWorkflowAuditPassPercentV1;

  message?: string;
}

export interface IGetWorkflowCountsResV1 {
  code?: number;

  data?: IWorkflowCountsV1;

  message?: string;
}

export interface IGetWorkflowCreatedCountsEachDayResV1 {
  code?: number;

  data?: IWorkflowCreatedCountsEachDayV1;

  message?: string;
}

export interface IGetWorkflowDurationOfWaitingForAuditResV1 {
  code?: number;

  data?: IWorkflowStageDuration;

  message?: string;
}

export interface IGetWorkflowDurationOfWaitingForExecutionResV1 {
  code?: number;

  data?: IWorkflowStageDuration;

  message?: string;
}

export interface IGetWorkflowPassPercentResV1 {
  code?: number;

  data?: IWorkflowPassPercentV1;

  message?: string;
}

export interface IGetWorkflowPercentCountedByInstanceTypeResV1 {
  code?: number;

  data?: IWorkflowPercentCountedByInstanceTypeV1;

  message?: string;
}

export interface IGetWorkflowRejectedPercentGroupByCreatorResV1 {
  code?: number;

  data?: IWorkflowRejectedPercentGroupByCreator[];

  message?: string;
}

export interface IGetWorkflowRejectedPercentGroupByInstanceResV1 {
  code?: number;

  data?: IWorkflowRejectedPercentGroupByInstance[];

  message?: string;
}

export interface IGetWorkflowResV1 {
  code?: number;

  data?: IWorkflowResV1;

  message?: string;
}

export interface IGetWorkflowStatusCountResV1 {
  code?: number;

  data?: IWorkflowStatusCountV1;

  message?: string;
}

export interface IGetWorkflowTasksItemV1 {
  current_step_assignee_user_name_list?: string[];

  exec_end_time?: string;

  exec_start_time?: string;

  execution_user_name?: string;

  instance_maintenance_times?: IMaintenanceTimeResV1[];

  instance_name?: string;

  schedule_time?: string;

  status?: GetWorkflowTasksItemV1StatusEnum;

  task_id?: number;

  task_pass_rate?: number;

  task_score?: number;
}

export interface IGetWorkflowTasksResV1 {
  code?: number;

  data?: IGetWorkflowTasksItemV1[];

  message?: string;
}

export interface IGetWorkflowTemplateResV1 {
  code?: number;

  data?: IWorkflowTemplateDetailResV1;

  message?: string;
}

export interface IGetWorkflowsResV1 {
  code?: number;

  data?: IWorkflowDetailResV1[];

  message?: string;

  total_nums?: number;
}

export interface IInstanceAdditionalParamResV1 {
  description?: string;

  name?: string;

  type?: string;

  value?: string;
}

export interface IInstanceConnectableResV1 {
  connect_error_message?: string;

  is_instance_connectable?: boolean;
}

export interface IInstanceConnectionResV1 {
  connect_error_message?: string;

  instance_name?: string;

  is_instance_connectable?: boolean;
}

export interface IInstanceForCheckConnection {
  name?: string;
}

export interface IInstanceForCreatingTask {
  instance_name?: string;

  instance_schema?: string;
}

export interface IInstanceSchemaResV1 {
  schema_name_list?: string[];
}

export interface IInstanceTableMeta {
  columns?: ITableColumns;

  create_table_sql?: string;

  indexes?: ITableIndexes;

  name?: string;

  schema?: string;
}

export interface IInstanceTipResV1 {
  host?: string;

  instance_id?: string;

  instance_name?: string;

  instance_type?: string;

  port?: string;

  workflow_template_id?: number;
}

export interface IInstanceTypePercent {
  count?: number;

  percent?: number;

  type?: string;
}

export interface IInstancesTypePercentV1 {
  instance_total_num?: number;

  instance_type_percents?: IInstanceTypePercent[];
}

export interface ILicenseItem {
  description?: string;

  limit?: string;

  name?: string;
}

export interface ILicenseUsageItem {
  is_limited?: boolean;

  limit?: number;

  resource_type?: string;

  resource_type_desc?: string;

  used?: number;
}

export interface ILicenseUsageV1 {
  instances_usage?: ILicenseUsageItem[];

  users_usage?: ILicenseUsageItem;
}

export interface IListTableBySchemaResV1 {
  code?: number;

  data?: ITable[];

  message?: string;
}

export interface IMaintenanceTimeResV1 {
  maintenance_start_time?: ITimeResV1;

  maintenance_stop_time?: ITimeResV1;
}

export interface IOperationActionList {
  desc?: string;

  operation_action?: string;

  operation_type?: string;
}

export interface IOperationRecordList {
  id?: number;

  operation_action?: string;

  operation_content?: string;

  operation_time?: string;

  operation_type_name?: string;

  operation_user?: IOperationUser;

  project_name?: string;

  status?: OperationRecordListStatusEnum;
}

export interface IOperationResV1 {
  op_code?: number;

  op_desc?: string;
}

export interface IOperationTypeNameList {
  desc?: string;

  operation_type_name?: string;
}

export interface IOperationUser {
  ip?: string;

  user_name?: string;
}

export interface IParseProjectRuleTemplateFileResDataV1 {
  db_type?: string;

  desc?: string;

  name?: string;

  rule_list?: IRuleResV1[];
}

export interface IParseProjectRuleTemplateFileResV1 {
  code?: number;

  data?: IParseProjectRuleTemplateFileResDataV1;

  message?: string;
}

export interface IPartialSyncAuditPlanSQLsReqV1 {
  audit_plan_sql_list?: IAuditPlanSQLReqV1[];
}

export interface IPersonaliseReqV1 {
  title?: string;
}

export interface IProjectRuleTemplateResV1 {
  db_type?: string;

  desc?: string;

  rule_template_name?: string;
}

export interface IProjectScore {
  score?: number;
}

export interface IRejectWorkflowReqV1 {
  reason?: string;
}

export interface IRiskAuditPlan {
  audit_plan_name?: string;

  audit_plan_report_id?: number;

  audit_plan_report_timestamp?: string;

  risk_sql_count?: number;

  trigger_audit_plan_time?: string;
}

export interface IRiskWorkflow {
  create_user_name?: string;

  update_time?: string;

  workflow_id?: string;

  workflow_name?: string;

  workflow_status?: string;
}

export interface IRoleUserCount {
  count?: number;

  role?: string;
}

export interface IRuleInfo {
  annotation?: string;

  desc?: string;
}

export interface IRuleKnowledgeResV1 {
  knowledge_content?: string;

  rule?: IRuleInfo;
}

export interface IRuleParamReqV1 {
  key?: string;

  value?: string;
}

export interface IRuleParamResV1 {
  desc?: string;

  key?: string;

  type?: RuleParamResV1TypeEnum;

  value?: string;
}

export interface IRuleProjectTemplateDetailResV1 {
  db_type?: string;

  desc?: string;

  rule_list?: IRuleResV1[];

  rule_template_name?: string;
}

export interface IRuleReqV1 {
  is_custom_rule?: boolean;

  level?: string;

  name?: string;

  params?: IRuleParamReqV1[];
}

export interface IRuleResV1 {
  annotation?: string;

  db_type?: string;

  desc?: string;

  is_custom_rule?: boolean;

  level?: RuleResV1LevelEnum;

  params?: IRuleParamResV1[];

  rule_name?: string;

  type?: string;
}

export interface IRuleTemplateDetailResV1 {
  db_type?: string;

  desc?: string;

  rule_list?: IRuleResV1[];

  rule_template_name?: string;
}

export interface IRuleTemplateResV1 {
  db_type?: string;

  desc?: string;

  rule_template_name?: string;
}

export interface IRuleTemplateTipResV1 {
  db_type?: string;

  rule_template_id?: string;

  rule_template_name?: string;
}

export interface IRuleTypeV1 {
  is_custom_rule_type?: boolean;

  rule_count?: number;

  rule_type?: string;
}

export interface ISQLAuditRecord {
  created_at?: string;

  creator?: string;

  instance?: ISQLAuditRecordInstance;

  sql_audit_record_id?: string;

  sql_audit_status?: string;

  tags?: string[];

  task?: IAuditTaskResV1;
}

export interface ISQLAuditRecordInstance {
  db_host?: string;

  db_port?: string;
}

export interface ISQLAuditRecordResData {
  sql_audit_record_id?: string;

  task?: IAuditTaskResV1;
}

export interface ISQLExplain {
  classic_result?: IExplainClassicResult;

  err_message?: string;

  sql?: string;
}

export interface ISQLQueryConfigResV1 {
  allow_query_when_less_than_audit_level?: SQLQueryConfigResV1AllowQueryWhenLessThanAuditLevelEnum;

  audit_enabled?: boolean;

  max_pre_query_rows?: number;

  query_timeout_second?: number;
}

export interface ISource {
  audit_plan_name?: string;

  sql_audit_record_ids?: string[];

  type?: SourceTypeEnum;
}

export interface ISqlAnalysisResDataV1 {
  sql_explain?: ISQLExplain;

  table_metas?: ITableMeta[];
}

export interface ISqlAverageExecutionTime {
  average_execution_seconds?: number;

  instance_name?: string;

  max_execution_seconds?: number;

  min_execution_seconds?: number;
}

export interface ISqlExecutionFailPercent {
  instance_name?: string;

  percent?: number;
}

export interface ISqlManage {
  appear_num?: number;

  assignees?: string[];

  audit_result?: IAuditResult[];

  first_appear_time?: string;

  id?: number;

  instance_name?: string;

  last_appear_time?: string;

  remark?: string;

  schema_name?: string;

  source?: ISource;

  sql?: string;

  sql_fingerprint?: string;

  status?: SqlManageStatusEnum;
}

export interface IStatisticAuditPlanResV1 {
  code?: number;

  data?: IDBTypeAuditPlan[];

  message?: string;
}

export interface IStatisticRiskWorkflowResV1 {
  code?: number;

  data?: IRiskWorkflow[];

  message?: string;
}

export interface IStatisticsAuditedSQLResV1 {
  code?: number;

  data?: IAuditedSQLCount;

  message?: string;

  risk_rate?: number;
}

export interface ISystemVariablesResV1 {
  operation_record_expired_hours?: number;

  url?: string;

  workflow_expired_hours?: number;
}

export interface ITable {
  name?: string;
}

export interface ITableColumns {
  head?: ITableMetaItemHeadResV1[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface ITableIndexes {
  head?: ITableMetaItemHeadResV1[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface ITableMeta {
  columns?: ITableColumns;

  create_table_sql?: string;

  indexes?: ITableIndexes;

  message?: string;

  name?: string;

  schema?: string;
}

export interface ITableMetaItemHeadResV1 {
  desc?: string;

  field_name?: string;
}

export interface ITestAuditPlanNotifyConfigResDataV1 {
  is_notify_send_normal?: boolean;

  send_error_message?: string;
}

export interface ITestAuditPlanNotifyConfigResV1 {
  code?: number;

  data?: ITestAuditPlanNotifyConfigResDataV1;

  message?: string;
}

export interface ITestDingTalkConfigResDataV1 {
  is_ding_talk_send_normal?: boolean;

  send_error_message?: string;
}

export interface ITestDingTalkConfigResV1 {
  code?: number;

  data?: ITestDingTalkConfigResDataV1;

  message?: string;
}

export interface ITestFeishuConfigResDataV1 {
  error_message?: string;

  is_message_sent_normally?: boolean;
}

export interface ITestFeishuConfigResV1 {
  code?: number;

  data?: ITestFeishuConfigResDataV1;

  message?: string;
}

export interface ITestFeishuConfigurationReqV1 {
  account?: string;

  account_type?: TestFeishuConfigurationReqV1AccountTypeEnum;
}

export interface ITimeResV1 {
  hour?: number;

  minute?: number;
}

export interface ITriggerAuditPlanResV1 {
  code?: number;

  data?: IAuditPlanReportResV1;

  message?: string;
}

export interface IUpdateAuditPlanNotifyConfigReqV1 {
  enable_email_notify?: boolean;

  enable_web_hook_notify?: boolean;

  notify_interval?: number;

  notify_level?: UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum;

  web_hook_template?: string;

  web_hook_url?: string;
}

export interface IUpdateAuditPlanReqV1 {
  audit_plan_cron?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_params?: IAuditPlanParamReqV1[];

  rule_template_name?: string;
}

export interface IUpdateAuditTaskSQLsReqV1 {
  description?: string;
}

export interface IUpdateAuditWhitelistReqV1 {
  desc?: string;

  match_type?: UpdateAuditWhitelistReqV1MatchTypeEnum;

  value?: string;
}

export interface IUpdateCustomRuleReqV1 {
  annotation?: string;

  desc?: string;

  level?: UpdateCustomRuleReqV1LevelEnum;

  rule_script?: string;

  type?: string;
}

export interface IUpdateDingTalkConfigurationReqV1 {
  app_key: string;

  app_secret: string;

  is_enable_ding_talk_notify: boolean;
}

export interface IUpdateFeishuConfigurationReqV1 {
  app_id: string;

  app_secret: string;

  is_feishu_notification_enabled: boolean;
}

export interface IUpdateProjectRuleTemplateReqV1 {
  desc?: string;

  rule_list?: IRuleReqV1[];
}

export interface IUpdateRuleKnowledgeReq {
  knowledge_content?: string;
}

export interface IUpdateRuleTemplateReqV1 {
  desc?: string;

  rule_list?: IRuleReqV1[];
}

export interface IUpdateSQLAuditRecordReqV1 {
  tags?: string[];
}

export interface IUpdateSystemVariablesReqV1 {
  operation_record_expired_hours?: number;

  url?: string;

  workflow_expired_hours?: number;
}

export interface IUpdateWorkflowReqV1 {
  task_ids?: number[];
}

export interface IUpdateWorkflowScheduleReqV1 {
  schedule_time?: string;
}

export interface IUpdateWorkflowTemplateReqV1 {
  allow_submit_when_less_audit_level?: UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum;

  desc?: string;

  workflow_step_template_list?: IWorkFlowStepTemplateReqV1[];
}

export interface IUploadLogoResDataV1 {
  logo_url?: string;
}

export interface IUploadLogoResV1 {
  code?: number;

  data?: IUploadLogoResDataV1;

  message?: string;
}

export interface IUserTipResV1 {
  user_id?: string;

  user_name?: string;
}

export interface IWorkFlowStepTemplateReqV1 {
  approved_by_authorized?: boolean;

  assignee_user_id_list?: string[];

  desc?: string;

  execute_by_authorized?: boolean;

  type?: WorkFlowStepTemplateReqV1TypeEnum;
}

export interface IWorkFlowStepTemplateResV1 {
  approved_by_authorized?: boolean;

  assignee_user_id_list?: string[];

  desc?: string;

  execute_by_authorized?: boolean;

  number?: number;

  type?: string;
}

export interface IWorkflowAuditPassPercentV1 {
  audit_pass_percent?: number;
}

export interface IWorkflowCountsV1 {
  today_count?: number;

  total?: number;
}

export interface IWorkflowCreatedCountsEachDayItem {
  date?: string;

  value?: number;
}

export interface IWorkflowCreatedCountsEachDayV1 {
  samples?: IWorkflowCreatedCountsEachDayItem[];
}

export interface IWorkflowDetailResV1 {
  create_time?: string;

  create_user_name?: string;

  current_step_assignee_user_name_list?: string[];

  current_step_type?: WorkflowDetailResV1CurrentStepTypeEnum;

  desc?: string;

  project_name?: string;

  status?: WorkflowDetailResV1StatusEnum;

  workflow_id?: string;

  workflow_name?: string;
}

export interface IWorkflowPassPercentV1 {
  audit_pass_percent?: number;

  execution_success_percent?: number;
}

export interface IWorkflowPercentCountedByInstanceType {
  count?: number;

  instance_type?: string;

  percent?: number;
}

export interface IWorkflowPercentCountedByInstanceTypeV1 {
  workflow_percents?: IWorkflowPercentCountedByInstanceType[];

  workflow_total_num?: number;
}

export interface IWorkflowRecordResV1 {
  current_step_number?: number;

  status?: WorkflowRecordResV1StatusEnum;

  tasks?: IWorkflowTaskItem[];

  workflow_step_list?: IWorkflowStepResV1[];
}

export interface IWorkflowRejectedPercentGroupByCreator {
  creator?: string;

  rejected_percent?: number;

  workflow_total_num?: number;
}

export interface IWorkflowRejectedPercentGroupByInstance {
  instance_name?: string;

  rejected_percent?: number;

  workflow_total_num?: number;
}

export interface IWorkflowResV1 {
  create_time?: string;

  create_user_name?: string;

  desc?: string;

  mode?: WorkflowResV1ModeEnum;

  record?: IWorkflowRecordResV1;

  record_history_list?: IWorkflowRecordResV1[];

  workflow_name?: string;
}

export interface IWorkflowStageDuration {
  minutes?: number;
}

export interface IWorkflowStatisticsResV1 {
  my_need_execute_workflow_number?: number;

  my_need_review_workflow_number?: number;

  my_on_process_workflow_number?: number;

  my_rejected_workflow_number?: number;

  need_me_to_execute_workflow_number?: number;

  need_me_to_review_workflow_number?: number;
}

export interface IWorkflowStatusCountV1 {
  closed_count?: number;

  executing_count?: number;

  executing_failed_count?: number;

  execution_success_count?: number;

  rejected_count?: number;

  waiting_for_audit_count?: number;

  waiting_for_execution_count?: number;
}

export interface IWorkflowStepResV1 {
  assignee_user_name_list?: string[];

  desc?: string;

  number?: number;

  operation_time?: string;

  operation_user_name?: string;

  reason?: string;

  state?: WorkflowStepResV1StateEnum;

  type?: WorkflowStepResV1TypeEnum;

  workflow_step_id?: number;
}

export interface IWorkflowTaskItem {
  task_id?: number;
}

export interface IWorkflowTemplateDetailResV1 {
  allow_submit_when_less_audit_level?: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum;

  desc?: string;

  update_time?: string;

  workflow_step_template_list?: IWorkFlowStepTemplateResV1[];

  workflow_template_name?: string;
}

export interface IAffectRows {
  count?: number;

  err_message?: string;
}

export interface IAuditPlanReportSQLResV2 {
  audit_plan_report_sql?: string;

  audit_plan_report_sql_audit_result?: IAuditResult[];

  number?: number;
}

export interface IAuditPlanResV2 {
  audit_plan_cron?: string;

  audit_plan_db_type?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_meta?: IAuditPlanMetaV1;

  audit_plan_name?: string;

  audit_plan_token?: string;

  rule_template?: IRuleTemplateV2;
}

export interface IAuditResDataV2 {
  audit_level?: AuditResDataV2AuditLevelEnum;

  pass_rate?: number;

  score?: number;

  sql_results?: IAuditSQLResV2[];
}

export interface IAuditSQLResV2 {
  audit_level?: string;

  audit_result?: IAuditResult[];

  exec_sql?: string;

  number?: number;
}

export interface IAuditTaskSQLResV2 {
  audit_level?: string;

  audit_result?: IAuditResult[];

  audit_status?: string;

  description?: string;

  exec_result?: string;

  exec_sql?: string;

  exec_status?: string;

  number?: number;

  rollback_sql?: string;
}

export interface IBatchCancelWorkflowsReqV2 {
  workflow_id_list?: string[];
}

export interface IBatchCompleteWorkflowsReqV2 {
  workflow_id_list?: string[];
}

export interface ICreateWorkflowReqV2 {
  desc?: string;

  task_ids?: number[];

  workflow_subject?: string;
}

export interface ICreateWorkflowResV2 {
  code?: number;

  data?: ICreateWorkflowResV2Data;

  message?: string;
}

export interface ICreateWorkflowResV2Data {
  workflow_id?: string;
}

export interface IDirectAuditFileReqV2 {
  file_contents?: string[];

  instance_name?: string;

  instance_type?: string;

  project_name?: string;

  schema_name?: string;

  sql_type?: DirectAuditFileReqV2SqlTypeEnum;
}

export interface IDirectAuditReqV2 {
  instance_type?: string;

  sql_content?: string;

  sql_type?: DirectAuditReqV2SqlTypeEnum;
}

export interface IDirectAuditResV2 {
  code?: number;

  data?: IAuditResDataV2;

  message?: string;
}

export interface IDriverMeta {
  default_port?: number;

  driver_name?: string;

  logo_url?: string;
}

export interface IGetAuditPlanAnalysisDataResV2 {
  code?: number;

  data?: ITaskAnalysisDataV2;

  message?: string;
}

export interface IGetAuditPlanReportSQLsResV2 {
  code?: number;

  data?: IAuditPlanReportSQLResV2[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlansResV2 {
  code?: number;

  data?: IAuditPlanResV2[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditTaskSQLsResV2 {
  code?: number;

  data?: IAuditTaskSQLResV2[];

  message?: string;

  total_nums?: number;
}

export interface IGetDriversRes {
  code?: number;

  data?: IDriverMeta[];

  message?: string;
}

export interface IGetInstanceResV2 {
  code?: number;

  data?: IInstanceResV2;

  message?: string;
}

export interface IGetTaskAnalysisDataResV2 {
  code?: number;

  data?: ITaskAnalysisDataV2;

  message?: string;
}

export interface IGetWorkflowResV2 {
  code?: number;

  data?: IWorkflowResV2;

  message?: string;
}

export interface IGetWorkflowTasksItemV2 {
  current_step_assignee_user_name_list?: string[];

  exec_end_time?: string;

  exec_start_time?: string;

  execution_user_name?: string;

  instance_maintenance_times?: IMaintenanceTimeResV1[];

  instance_name?: string;

  schedule_time?: string;

  status?: GetWorkflowTasksItemV2StatusEnum;

  task_id?: number;

  task_pass_rate?: number;

  task_score?: number;
}

export interface IGetWorkflowTasksResV2 {
  code?: number;

  data?: IGetWorkflowTasksItemV2[];

  message?: string;
}

export interface IInstanceResV2 {
  additional_params?: IInstanceAdditionalParamResV1[];

  db_host?: string;

  db_port?: string;

  db_type?: string;

  db_user?: string;

  desc?: string;

  instance_name?: string;

  maintenance_times?: IMaintenanceTimeResV1[];

  rule_template?: IRuleTemplateV2;

  source?: string;

  sql_query_config?: ISQLQueryConfigResV1;
}

export interface IPerformanceStatistics {
  affect_rows?: IAffectRows;
}

export interface IRejectWorkflowReqV2 {
  reason?: string;
}

export interface IRuleTemplateV2 {
  is_global_rule_template?: boolean;

  name?: string;
}

export interface ITableMetas {
  err_message?: string;

  table_meta_items?: ITableMeta[];
}

export interface ITaskAnalysisDataV2 {
  performance_statistics?: IPerformanceStatistics;

  sql_explain?: ISQLExplain;

  table_metas?: ITableMetas;
}

export interface IUpdateWorkflowReqV2 {
  task_ids?: number[];
}

export interface IUpdateWorkflowScheduleReqV2 {
  schedule_time?: string;
}

export interface IWorkflowRecordResV2 {
  current_step_number?: number;

  status?: WorkflowRecordResV2StatusEnum;

  tasks?: IWorkflowTaskItem[];

  workflow_step_list?: IWorkflowStepResV2[];
}

export interface IWorkflowResV2 {
  create_time?: string;

  create_user_name?: string;

  desc?: string;

  mode?: WorkflowResV2ModeEnum;

  record?: IWorkflowRecordResV2;

  record_history_list?: IWorkflowRecordResV2[];

  workflow_id?: string;

  workflow_name?: string;
}

export interface IWorkflowStepResV2 {
  assignee_user_name_list?: string[];

  desc?: string;

  number?: number;

  operation_time?: string;

  operation_user_name?: string;

  reason?: string;

  state?: WorkflowStepResV2StateEnum;

  type?: WorkflowStepResV2TypeEnum;

  workflow_step_id?: number;
}
