import {
  RuleCategoryStatisticCategoryEnum,
  AssociateWorkflowsStatusEnum,
  AuditPlanParamResV1TypeEnum,
  AuditPlanReportResV1AuditLevelEnum,
  AuditPlanSQLHeadV1TypeEnum,
  AuditPlanTypeResBaseActiveStatusEnum,
  AuditPlanTypeResBaseLastCollectionStatusEnum,
  AuditPlanTypesV1InstanceTypeEnum,
  AuditResDataV1AuditLevelEnum,
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum,
  BackupSqlDataBackupStatusEnum,
  BackupSqlDataBackupStrategyEnum,
  BatchUpdateSqlManageReqPriorityEnum,
  BatchUpdateSqlManageReqStatusEnum,
  BlacklistResV1TypeEnum,
  CreateAuditTaskReqV1ExecModeEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum,
  CreateAuditWhitelistReqV1MatchTypeEnum,
  CreateBlacklistReqV1TypeEnum,
  CreateCustomRuleReqV1LevelEnum,
  CustomRuleResV1LevelEnum,
  DatabaseDiffObjectObjectTypeEnum,
  DatabaseObjectObjectTypeEnum,
  DirectAuditFileReqV1SqlTypeEnum,
  DirectAuditReqV1SqlTypeEnum,
  FilterMetaFilterInputTypeEnum,
  FilterMetaFilterOpTypeEnum,
  GetWorkflowTasksItemV1StatusEnum,
  GlobalSqlManageProjectPriorityEnum,
  GlobalSqlManageStatusEnum,
  HighPriorityConditionReqOperatorEnum,
  HighPriorityConditionResV1TypeEnum,
  InstanceAuditPlanInfoActiveStatusEnum,
  InstanceAuditPlanInfoLastCollectionStatusEnum,
  InstanceAuditPlanResV1ActiveStatusEnum,
  InstanceTipResV1SupportedBackupStrategyEnum,
  ModuleRedDotModuleNameEnum,
  ObjectDiffResultComparisonResultEnum,
  OperationRecordListStatusEnum,
  RecordSourceNameEnum,
  ReportPushConfigListPushUserTypeEnum,
  ReportPushConfigListTriggerTypeEnum,
  RewriteSuggestionAuditLevelEnum,
  RewriteSuggestionTypeEnum,
  RuleParamResV1TypeEnum,
  RuleResV1LevelEnum,
  SQLQueryConfigResV1AllowQueryWhenLessThanAuditLevelEnum,
  ScheduleTaskDefaultOptionDefaultSelectorEnum,
  SchemaObjectComparisonResultEnum,
  SqlManageAuditStatusEnum,
  SqlManageStatusEnum,
  SqlManageCodingReqPriorityEnum,
  SqlManageCodingReqTypeEnum,
  SqlVersionDetailResV1StatusEnum,
  SqlVersionResV1StatusEnum,
  TestFeishuConfigurationReqV1AccountTypeEnum,
  UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum,
  UpdateAuditPlanStatusReqV1ActiveEnum,
  UpdateAuditWhitelistReqV1MatchTypeEnum,
  UpdateBlacklistReqV1TypeEnum,
  UpdateCustomRuleReqV1LevelEnum,
  UpdateInstanceAuditPlanStatusReqV1ActiveEnum,
  UpdateReportPushConfigReqV1PushUserTypeEnum,
  UpdateReportPushConfigReqV1TriggerTypeEnum,
  UpdateSqlBackupStrategyReqStrategyEnum,
  UpdateTaskBackupStrategyReqStrategyEnum,
  UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  WorkFlowStepTemplateReqV1TypeEnum,
  WorkflowDetailResV1CurrentStepTypeEnum,
  WorkflowDetailResV1StatusEnum,
  WorkflowDetailWithInstanceStatusEnum,
  WorkflowDetailWithInstanceWorkflowReleaseStatusEnum,
  WorkflowRecordResV1StatusEnum,
  WorkflowResV1ModeEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
  pipelineNodeBaseAuditMethodEnum,
  pipelineNodeBaseObjectTypeEnum,
  pipelineNodeBaseTypeEnum,
  pipelineNodeDetailAuditMethodEnum,
  pipelineNodeDetailObjectTypeEnum,
  pipelineNodeDetailTypeEnum,
  updatePipelineNodeAuditMethodEnum,
  updatePipelineNodeObjectTypeEnum,
  updatePipelineNodeTypeEnum,
  AssociatedRollbackWorkflowStatusEnum,
  AssociatedStageWorkflowsStatusEnum,
  AuditResDataV2AuditLevelEnum,
  AuditTaskSQLResV2BackupStatusEnum,
  AuditTaskSQLResV2BackupStrategyEnum,
  DirectAuditFileReqV2SqlTypeEnum,
  DirectAuditReqV2SqlTypeEnum,
  GetWorkflowTasksItemV2StatusEnum,
  UpdateWorkflowScheduleReqV2NotifyTypeEnum,
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ExecModeEnum,
  WorkflowResV2ModeEnum,
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum
} from './common.enum';

export interface IBaseRes {
  code?: number;

  message?: string;
}

export interface IAuditResultInfo {
  errorInfo?: string;

  message?: string;
}

export interface II18nAuditResultInfo {
  [key: string]: any;
}

export interface IRuleCategoryStatistic {
  category?: RuleCategoryStatisticCategoryEnum;

  count?: number;

  tag?: string;
}

export interface IAbnormalAuditPlanInstance {
  instance_audit_plan_id?: number;

  instance_name?: string;
}

export interface IAffectRows {
  count?: number;

  err_message?: string;
}

export interface IAssociateWorkflows {
  desc?: string;

  status?: AssociateWorkflowsStatusEnum;

  workflow_id?: string;

  workflow_name?: string;
}

export interface IAuditFileResp {
  file_name?: string;
}

export interface IAuditPlan {
  audit_plan_params?: IAuditPlanParamReqV1[];

  audit_plan_type?: string;

  high_priority_conditions?: IHighPriorityConditionReq[];

  need_mark_high_priority_sql?: boolean;

  rule_template_name?: string;
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

  high_priority_conditions?: IHighPriorityConditionResV1[];

  instance_type?: string;
}

export interface IAuditPlanParamReqV1 {
  key?: string;

  value?: string;
}

export interface IAuditPlanParamResV1 {
  desc?: string;

  enums_value?: IEnumsValueResV1[];

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

export interface IAuditPlanRes {
  audit_plan_params?: IAuditPlanParamResV1[];

  audit_plan_type?: IAuditPlanTypeResBase;

  high_priority_conditions?: IHighPriorityConditionResV1[];

  need_mark_high_priority_sql?: boolean;

  rule_template_name?: string;
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

export interface IAuditPlanRuleTemplate {
  is_global_rule_template?: boolean;

  name?: string;
}

export interface IAuditPlanSQLDataResV1 {
  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface IAuditPlanSQLHeadV1 {
  desc?: string;

  field_name?: string;

  sortable?: boolean;

  type?: AuditPlanSQLHeadV1TypeEnum;
}

export interface IAuditPlanSQLMetaResV1 {
  filter_meta_list?: IFilterMeta[];

  head?: IAuditPlanSQLHeadV1[];
}

export interface IAuditPlanSQLReqV1 {
  audit_plan_sql_counter?: string;

  audit_plan_sql_fingerprint?: string;

  audit_plan_sql_last_receive_text?: string;

  audit_plan_sql_last_receive_timestamp?: string;

  audit_plan_sql_schema?: string;

  db_user?: string;

  endpoint?: string;

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

export interface IAuditPlanTypeResBase {
  active_status?: AuditPlanTypeResBaseActiveStatusEnum;

  audit_plan_id?: number;

  desc?: string;

  last_collection_status?: AuditPlanTypeResBaseLastCollectionStatusEnum;

  token?: string;

  type?: string;
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

  error_info?: string;

  execution_failed?: boolean;

  i18n_audit_result_info?: II18nAuditResultInfo;

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
  audit_files?: IAuditFileResp[];

  audit_level?: AuditTaskResV1AuditLevelEnum;

  backup_conflict_with_instance?: boolean;

  backup_max_rows?: number;

  enable_backup?: boolean;

  exec_end_time?: string;

  exec_mode?: string;

  exec_start_time?: string;

  file_order_method?: string;

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

  rollback_sqls?: string[];
}

export interface IAuditTasksGroupResV1 {
  task_group_id?: number;
}

export interface IAuditWhitelistResV1 {
  audit_whitelist_id?: number;

  desc?: string;

  last_match_time?: string;

  match_type?: string;

  matched_count?: number;

  value?: string;
}

export interface IAuditedSQLCount {
  risk_sql_count?: number;

  total_sql_count?: number;
}

export interface IBackupSqlData {
  backup_result?: string;

  backup_sqls?: string[];

  backup_status?: BackupSqlDataBackupStatusEnum;

  backup_strategy?: BackupSqlDataBackupStrategyEnum;

  description?: string;

  exec_order?: number;

  exec_sql_id?: number;

  exec_status?: string;

  instance_id?: string;

  instance_name?: string;

  origin_sql?: string;

  origin_task_id?: number;
}

export interface IBackupSqlListRes {
  code?: number;

  data?: IBackupSqlData[];

  message?: string;

  total_nums?: number;
}

export interface IBatchAssociateWorkflowsWithVersionReqV1 {
  workflow_ids?: string[];
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

export interface IBatchExecuteWorkflowsReqV1 {
  workflow_ids?: string[];
}

export interface IBatchGetInstanceConnectionsResV1 {
  code?: number;

  data?: IInstanceConnectionResV1[];

  message?: string;
}

export interface IBatchReleaseWorkflowReqV1 {
  release_workflows?: IReleaseWorkflows[];
}

export interface IBatchUpdateSqlManageReq {
  assignees?: string[];

  priority?: BatchUpdateSqlManageReqPriorityEnum;

  remark?: string;

  sql_manage_id_list?: number[];

  status?: BatchUpdateSqlManageReqStatusEnum;
}

export interface IBlacklistResV1 {
  blacklist_id?: number;

  content?: string;

  desc?: string;

  last_match_time?: string;

  matched_count?: number;

  type?: BlacklistResV1TypeEnum;
}

export interface IChartPoint {
  info?: Array<{
    [key: string]: string;
  }>;

  x?: string;

  y?: number;
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

export interface ICodingConfigurationV1 {
  coding_url?: string;

  is_coding_enabled?: boolean;
}

export interface ICodingResp {
  code?: string;

  message?: string;
}

export interface ICompanyNotice {
  notice_str?: string;
}

export interface ICreatInstanceAuditPlanRes {
  instance_audit_plan_id?: string;
}

export interface ICreatInstanceAuditPlanResV1 {
  code?: number;

  data?: ICreatInstanceAuditPlanRes;

  message?: string;
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

export interface ICreateAuditTaskReqV1 {
  backup_max_rows?: number;

  enable_backup?: boolean;

  exec_mode?: CreateAuditTaskReqV1ExecModeEnum;

  file_order_method?: string;

  instance_name?: string;

  instance_schema?: string;

  sql?: string;
}

export interface ICreateAuditTasksGroupReqV1 {
  exec_mode?: CreateAuditTasksGroupReqV1ExecModeEnum;

  file_order_method?: string;

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

export interface ICreateBlacklistReqV1 {
  content?: string;

  desc?: string;

  type?: CreateBlacklistReqV1TypeEnum;
}

export interface ICreateCustomRuleReqV1 {
  annotation?: string;

  db_type?: string;

  desc?: string;

  level?: CreateCustomRuleReqV1LevelEnum;

  rule_script?: string;

  tags?: string[];

  type?: string;
}

export interface ICreateInstanceAuditPlanReqV1 {
  audit_plans?: IAuditPlan[];

  instance_id?: string;
}

export interface ICreatePipelineReqV1 {
  address?: string;

  description?: string;

  name?: string;

  nodes?: IPipelineNodeBase[];
}

export interface ICreatePipelineResV1 {
  code?: number;

  data?: ICreatePipelineResData;

  message?: string;
}

export interface ICreateProjectRuleTemplateReqV1 {
  db_type?: string;

  desc?: string;

  rule_list?: IRuleReqV1[];

  rule_template_name?: string;

  rule_version?: string;
}

export interface ICreateRollbackWorkflowReq {
  desc?: string;

  rollback_sql_ids?: number[];

  sql_version_id?: number;

  task_ids?: number[];

  workflow_subject?: string;
}

export interface ICreateRollbackWorkflowRes {
  code?: number;

  data?: ICreateRollbackWorkflowResData;

  message?: string;
}

export interface ICreateRollbackWorkflowResData {
  workflow_id?: string;
}

export interface ICreateRuleTemplateReqV1 {
  db_type?: string;

  desc?: string;

  rule_list?: IRuleReqV1[];

  rule_template_name?: string;

  rule_version?: string;
}

export interface ICreateSQLAuditRecordResV1 {
  code?: number;

  data?: ISQLAuditRecordResData;

  message?: string;
}

export interface ICreateSqlVersionReqV1 {
  create_sql_version_stage?: ICreateSqlVersionStage[];

  desc?: string;

  version?: string;
}

export interface ICreateSqlVersionRes {
  sql_version_id?: number;
}

export interface ICreateSqlVersionResV1 {
  code?: number;

  data?: ICreateSqlVersionRes;

  message?: string;
}

export interface ICreateSqlVersionStage {
  create_stages_instance_dep?: ICreateStagesInstanceDep[];

  name?: string;

  stage_sequence?: number;
}

export interface ICreateStagesInstanceDep {
  next_stage_instance_id?: string;

  stage_instance_id?: string;
}

export interface ICreateWorkflowReqV1 {
  desc?: string;

  task_ids?: number[];

  workflow_subject?: string;
}

export interface ICustomRuleResV1 {
  annotation?: string;

  categories?: {
    [key: string]: string[];
  };

  db_type?: string;

  desc?: string;

  level?: CustomRuleResV1LevelEnum;

  rule_id?: string;

  rule_script?: string;

  type?: string;
}

export interface IDBPerformanceImproveOverview {
  avg_performance_improve?: number;

  instance_name?: string;
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

export interface IDashboardResV1 {
  workflow_statistics?: IWorkflowStatisticsResV1;
}

export interface IDatabaseComparisonObject {
  instance_id?: string;

  schema_name?: string;
}

export interface IDatabaseComparisonResV1 {
  code?: number;

  data?: ISchemaObject[];

  message?: string;
}

export interface IDatabaseComparisonStatements {
  base_sql?: ISQLStatement;

  comparison_sql?: ISQLStatement;
}

export interface IDatabaseComparisonStatementsResV1 {
  code?: number;

  data?: IDatabaseComparisonStatements;

  message?: string;
}

export interface IDatabaseDiffModifySQL {
  audit_error?: string;

  modify_sqls?: ISQLStatementWithAuditResult[];

  schema_name?: string;
}

export interface IDatabaseDiffObject {
  inconsistent_num?: number;

  object_type?: DatabaseDiffObjectObjectTypeEnum;

  objects_diff_result?: IObjectDiffResult[];
}

export interface IDatabaseDriverLogosV1 {
  db_type?: string;

  logo?: number[];
}

export interface IDatabaseDriverOptionsV1 {
  db_type?: string;

  params?: IInstanceAdditionalParamResV1[];
}

export interface IDatabaseObject {
  object_name?: string;

  object_type?: DatabaseObjectObjectTypeEnum;
}

export interface IDatabaseSchemaObject {
  base_schema_name?: string;

  comparison_schema_name?: string;

  database_objects?: IDatabaseObject[];
}

export interface IDepBetweenStageInstance {
  next_stage_instance_id?: string;

  next_stage_instance_name?: string;

  stage_instance_id?: string;

  stage_instance_name?: string;
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

export interface IEnumsValueResV1 {
  desc?: string;

  value?: string;
}

export interface IExplainClassicResult {
  head?: ITableMetaItemHeadResV1[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface IExplainValidationDetail {
  after_cost?: number;

  after_plan?: string;

  before_cost?: number;

  before_plan?: string;

  perform_improve_per?: number;
}

export interface IFeishuConfigurationV1 {
  app_id?: string;

  is_feishu_notification_enabled?: boolean;
}

export interface IFileToSort {
  file_id?: number;

  new_index?: number;
}

export interface IFilter {
  filter_between_value?: IFilterBetweenValue;

  filter_compare_value?: string;

  filter_name?: string;
}

export interface IFilterBetweenValue {
  from?: string;

  to?: string;
}

export interface IFilterMeta {
  desc?: string;

  filter_input_type?: FilterMetaFilterInputTypeEnum;

  filter_name?: string;

  filter_op_type?: FilterMetaFilterOpTypeEnum;

  filter_tip_list?: IFilterTip[];
}

export interface IFilterTip {
  desc?: string;

  group?: string;

  value?: string;
}

export interface IFullSyncAuditPlanSQLsReqV1 {
  audit_plan_sql_list?: IAuditPlanSQLReqV1[];
}

export interface IGenModifySQLResV1 {
  code?: number;

  data?: IDatabaseDiffModifySQL[];

  message?: string;
}

export interface IGenModifylSQLReqV1 {
  base_instance_id?: string;

  comparison_instance_id?: string;

  database_schema_objects?: IDatabaseSchemaObject[];
}

export interface IGetAbnormalAuditPlanInstancesResp {
  code?: number;

  data?: IAbnormalAuditPlanInstance[];

  message?: string;
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

export interface IGetAuditPlanSQLDataReqV1 {
  filter_list?: IFilter[];

  is_asc?: boolean;

  order_by?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetAuditPlanSQLDataResV1 {
  code?: number;

  data?: IAuditPlanSQLDataResV1;

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlanSQLExportReqV1 {
  filter_list?: IFilter[];

  is_asc?: boolean;

  order_by?: string;
}

export interface IGetAuditPlanSQLMetaResV1 {
  code?: number;

  data?: IAuditPlanSQLMetaResV1;

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

export interface IGetBlacklistResV1 {
  code?: number;

  data?: IBlacklistResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetCodingConfigurationResV1 {
  code?: number;

  data?: ICodingConfigurationV1;

  message?: string;
}

export interface IGetCompanyNoticeResp {
  code?: number;

  data?: ICompanyNotice;

  message?: string;
}

export interface IGetComparisonStatementsReqV1 {
  database_comparison_object?: IGetDatabaseComparisonReqV1;

  database_object?: IDatabaseObject;
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

export interface IGetDBPerformanceImproveOverviewResp {
  code?: number;

  data?: IDBPerformanceImproveOverview[];

  message?: string;
}

export interface IGetDashboardResV1 {
  code?: number;

  data?: IDashboardResV1;

  message?: string;
}

export interface IGetDatabaseComparisonReqV1 {
  base_db_object?: IDatabaseComparisonObject;

  comparison_db_object?: IDatabaseComparisonObject;
}

export interface IGetDatabaseDriverLogosResV1 {
  code?: number;

  data?: IDatabaseDriverLogosV1[];

  message?: string;
}

export interface IGetDatabaseDriverOptionsResV1 {
  code?: number;

  data?: IDatabaseDriverOptionsV1[];

  message?: string;
}

export interface IGetDepBetweenStageInstanceResV1 {
  code?: number;

  data?: IDepBetweenStageInstance[];

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

export interface IGetGlobalSqlManageListResp {
  code?: number;

  data?: IGlobalSqlManage[];

  message?: string;

  total_nums?: number;
}

export interface IGetGlobalSqlManageStatisticsResp {
  code?: number;

  message?: string;

  total_nums?: number;
}

export interface IGetInstanceAuditPlanDetailResV1 {
  code?: number;

  data?: IInstanceAuditPlanDetailResV1;

  message?: string;
}

export interface IGetInstanceAuditPlanOverviewResV1 {
  code?: number;

  data?: IInstanceAuditPlanInfo[];

  message?: string;
}

export interface IGetInstanceAuditPlansResV1 {
  code?: number;

  data?: IInstanceAuditPlanResV1[];

  message?: string;

  total_nums?: number;
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

export interface IGetModuleStatusResV1 {
  code?: number;

  data?: IModuleStatusRes;

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

export interface IGetOptimizationOverviewResp {
  code?: number;

  data?: IOptimizationRecordOverview[];

  message?: string;
}

export interface IGetOptimizationRecordRes {
  code?: number;

  data?: IOptimizationDetail;

  message?: string;
}

export interface IGetOptimizationRecordsRes {
  code?: number;

  data?: IOptimizationRecord[];

  message?: string;

  total_nums?: number;
}

export interface IGetOptimizationSQLRes {
  code?: number;

  data?: IOptimizationSQLDetail;

  message?: string;
}

export interface IGetOptimizationSQLsRes {
  code?: number;

  data?: IOptimizationSQL[];

  message?: string;

  total_nums?: number;
}

export interface IGetPipelineDetailResV1 {
  code?: number;

  data?: IPipelineDetailData;

  message?: string;
}

export interface IGetPipelinesResV1 {
  code?: number;

  data?: IPipelineDetail[];

  message?: string;

  total_nums?: number;
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

export interface IGetReportPushConfigsListResV1 {
  code?: number;

  data?: IReportPushConfigList[];

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

export interface IGetRuleCategoryStatisticResV1 {
  code?: number;

  data?: {
    [key: string]: IRuleCategoryStatistic[];
  };

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

export interface IGetSqlAverageExecutionTimeResV1 {
  code?: number;

  data?: ISqlAverageExecutionTime[];

  message?: string;
}

export interface IGetSqlDEVRecordListResp {
  code?: number;

  data?: ISqlDEVRecord[];

  message?: string;

  total_nums?: number;
}

export interface IGetSqlExecutionFailPercentResV1 {
  code?: number;

  data?: ISqlExecutionFailPercent[];

  message?: string;
}

export interface IGetSqlFileOrderMethodResV1 {
  code?: number;

  data?: ISqlFileOrderMethodRes;

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

export interface IGetSqlManageRuleTipsResp {
  code?: number;

  data?: IRuleTips[];

  message?: string;
}

export interface IGetSqlManageSqlAnalysisResp {
  code?: number;

  data?: ISqlAnalysis;

  message?: string;
}

export interface IGetSqlVersionDetailResV1 {
  code?: number;

  data?: ISqlVersionDetailResV1;

  message?: string;
}

export interface IGetSqlVersionListResV1 {
  code?: number;

  data?: ISqlVersionResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetSystemModuleRedDotsRes {
  code?: number;

  data?: IModuleRedDots;

  message?: string;
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

export interface IGetWechatAuditConfigurationResV1 {
  code?: number;

  data?: IWechatConfigurationV1;

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

export interface IGetWorkflowStatisticOfInstancesResV1 {
  code?: number;

  data?: IWorkflowStatisticOfInstance[];

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

export interface IGetWorkflowsThatCanBeAssociatedToVersionResV1 {
  code?: number;

  data?: IAssociateWorkflows[];

  message?: string;
}

export interface IGlobalSqlManage {
  audit_result?: IAuditResult[];

  first_appear_timestamp?: string;

  id?: number;

  instance_id?: string;

  instance_name?: string;

  problem_descriptions?: string[];

  project_name?: string;

  project_priority?: GlobalSqlManageProjectPriorityEnum;

  project_uid?: string;

  source?: ISource;

  sql?: string;

  status?: GlobalSqlManageStatusEnum;
}

export interface IGlobalWorkflowStatisticsResV1 {
  code?: number;

  message?: string;

  total_nums?: number;
}

export interface IHighPriorityConditionReq {
  key?: string;

  operator?: HighPriorityConditionReqOperatorEnum;

  value?: string;
}

export interface IHighPriorityConditionResV1 {
  desc?: string;

  enums_value?: IEnumsValueResV1[];

  key?: string;

  operator?: IOperatorResV1;

  type?: HighPriorityConditionResV1TypeEnum;

  value?: string;
}

export interface IInstanceAdditionalParamResV1 {
  description?: string;

  name?: string;

  type?: string;

  value?: string;
}

export interface IInstanceAuditPlanDetailResV1 {
  audit_plans?: IAuditPlanRes[];

  business?: string;

  instance_id?: string;

  instance_name?: string;

  instance_type?: string;
}

export interface IInstanceAuditPlanInfo {
  active_status?: InstanceAuditPlanInfoActiveStatusEnum;

  audit_plan_db_type?: string;

  audit_plan_instance_name?: string;

  audit_plan_rule_template?: IAuditPlanRuleTemplate;

  audit_plan_type?: IAuditPlanTypeResBase;

  exec_cmd?: string;

  id?: number;

  last_collection_status?: InstanceAuditPlanInfoLastCollectionStatusEnum;

  last_collection_time?: string;

  total_sql_nums?: number;

  unsolved_sql_nums?: number;
}

export interface IInstanceAuditPlanResV1 {
  active_status?: InstanceAuditPlanResV1ActiveStatusEnum;

  audit_plan_types?: IAuditPlanTypeResBase[];

  business?: string;

  create_time?: string;

  creator?: string;

  instance_audit_plan_id?: number;

  instance_id?: string;

  instance_name?: string;

  instance_type?: string;
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

export interface IInstanceInfo {
  instance_id?: string;

  instance_name?: string;
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
  backup_max_rows?: number;

  enable_backup?: boolean;

  host?: string;

  instance_id?: string;

  instance_name?: string;

  instance_type?: string;

  port?: string;

  supported_backup_strategy?: InstanceTipResV1SupportedBackupStrategyEnum[];

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

export interface ILockSqlVersionReqV1 {
  is_locked?: boolean;
}

export interface IMaintenanceTimeResV1 {
  maintenance_start_time?: ITimeResV1;

  maintenance_stop_time?: ITimeResV1;
}

export interface IModuleRedDot {
  has_red_dot?: boolean;

  module_name?: ModuleRedDotModuleNameEnum;
}

export type IModuleRedDots = IModuleRedDot[];

export interface IModuleStatusRes {
  is_supported?: boolean;
}

export interface IObjectDiffResult {
  comparison_result?: ObjectDiffResultComparisonResultEnum;

  object_name?: string;
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

export interface IOperatorResV1 {
  operator_enums_value?: IEnumsValueResV1[];

  operator_value?: string;
}

export interface IOptimizationDetail {
  basic_summary?: IOptimizationsummary;

  created_time?: string;

  created_user?: string;

  db_type?: string;

  index_recommendations?: string[];

  instance_name?: string;

  optimization_id?: string;

  optimization_name?: string;

  status?: string;
}

export interface IOptimizationRecord {
  created_time?: string;

  created_user?: string;

  db_type?: string;

  instance_name?: string;

  optimization_id?: string;

  optimization_name?: string;

  performance_gain?: number;

  status?: string;
}

export interface IOptimizationRecordOverview {
  record_number?: number;

  time?: string;
}

export interface IOptimizationSQL {
  contributing_indices?: string;

  number?: number;

  number_of_hit_index?: number;

  number_of_index?: number;

  number_of_rewrite?: number;

  number_of_syntax_error?: number;

  original_sql?: string;

  performance?: number;
}

export interface IOptimizationSQLDetail {
  explain_validation_details?: IExplainValidationDetail;

  index_recommendations?: string[];

  optimized_sql?: string;

  original_sql?: string;

  triggered_rule?: IRewriteRule[];
}

export interface IOptimizationsummary {
  number_of_index?: number;

  number_of_query?: number;

  number_of_query_index?: number;

  number_of_rewrite?: number;

  number_of_rewritten_query?: number;

  number_of_syntax_error?: number;

  performance_gain?: number;
}

export interface IOptimizeSQLReq {
  db_type?: string;

  instance_name?: string;

  optimization_name?: string;

  schema_name?: string;

  sql_content?: string;
}

export interface IOptimizeSQLRes {
  code?: number;

  data?: IOptimizeSQLResData;

  message?: string;
}

export interface IOptimizeSQLResData {
  sql_optimization_record_id?: string;
}

export interface IParseProjectRuleTemplateFileResDataV1 {
  db_type?: string;

  desc?: string;

  name?: string;

  rule_list?: IRuleResV1[];

  rule_version?: string;
}

export interface IParseProjectRuleTemplateFileResV1 {
  code?: number;

  data?: IParseProjectRuleTemplateFileResDataV1;

  message?: string;
}

export interface IPartialSyncAuditPlanSQLsReqV1 {
  audit_plan_sql_list?: IAuditPlanSQLReqV1[];
}

export interface IPerformanceStatistics {
  affect_rows?: IAffectRows;
}

export interface IPostSqlManageCodingResp {
  code?: number;

  data?: ICodingResp;

  message?: string;
}

export interface IProjectRuleTemplateResV1 {
  db_type?: string;

  desc?: string;

  rule_template_name?: string;
}

export interface IProjectScore {
  score?: number;
}

export interface IRecordSource {
  name?: RecordSourceNameEnum;

  value?: string;
}

export interface IRejectWorkflowReqV1 {
  reason?: string;
}

export interface IReleaseWorkflows {
  target_release_instances?: ITargetReleaseInstance[];

  workflow_id?: string;
}

export interface IReportPushConfigList {
  enabled?: boolean;

  last_push_time?: string;

  push_frequency_cron?: string;

  push_user_Type?: ReportPushConfigListPushUserTypeEnum;

  push_user_list?: string[];

  report_push_config_id?: string;

  trigger_type?: ReportPushConfigListTriggerTypeEnum;

  type?: string;
}

export interface IRewriteRule {
  message?: string;

  rewritten_queries_str?: string;

  rule_code?: string;

  rule_name?: string;

  violated_queries_str?: string;
}

export interface IRewriteSQLData {
  business_desc?: string;

  business_non_equivalent_desc?: string;

  logic_desc?: string;

  rewritten_sql?: string;

  rewritten_sql_business_desc?: string;

  rewritten_sql_logic_desc?: string;

  suggestions?: IRewriteSuggestion[];
}

export interface IRewriteSQLReq {
  enable_structure_type?: boolean;
}

export interface IRewriteSQLRes {
  code?: number;

  data?: IRewriteSQLData;

  message?: string;
}

export interface IRewriteSuggestion {
  audit_level?: RewriteSuggestionAuditLevelEnum;

  ddl_dcl?: string;

  ddl_dcl_desc?: string;

  desc?: string;

  rewritten_sql?: string;

  rule_name?: string;

  type?: RewriteSuggestionTypeEnum;
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

  rule_version?: string;
}

export interface IRuleReqV1 {
  is_custom_rule?: boolean;

  level?: string;

  name?: string;

  params?: IRuleParamReqV1[];
}

export interface IRuleResV1 {
  annotation?: string;

  categories?: {
    [key: string]: string[];
  };

  db_type?: string;

  desc?: string;

  has_audit_power?: boolean;

  has_rewrite_power?: boolean;

  is_custom_rule?: boolean;

  level?: RuleResV1LevelEnum;

  params?: IRuleParamResV1[];

  rule_name?: string;

  type?: string;
}

export interface IRuleRespV1 {
  desc?: string;

  rule_name?: string;
}

export interface IRuleTemplateDetailResV1 {
  db_type?: string;

  desc?: string;

  rule_list?: IRuleResV1[];

  rule_template_name?: string;

  rule_version?: string;
}

export interface IRuleTemplateResV1 {
  db_type?: string;

  desc?: string;

  rule_template_name?: string;

  rule_version?: string;
}

export interface IRuleTemplateTipResV1 {
  db_type?: string;

  is_default_rule_template?: boolean;

  rule_template_id?: string;

  rule_template_name?: string;

  rule_version?: string;
}

export interface IRuleTips {
  db_type?: string;

  rule?: IRuleRespV1[];
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

export interface ISQLAuditResult {
  db_type?: string;

  error_info?: string;

  execution_failed?: boolean;

  i18n_audit_result_info?: II18nAuditResultInfo;

  level?: string;

  message?: string;

  rule_name?: string;
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

export interface ISQLStatement {
  audit_error?: string;

  sql_statement_with_audit?: ISQLStatementWithAuditResult;
}

export interface ISQLStatementWithAuditResult {
  audit_results?: ISQLAuditResult[];

  sql_statement?: string;
}

export interface IScheduleTaskDefaultOption {
  default_selector?: ScheduleTaskDefaultOptionDefaultSelectorEnum;
}

export interface IScheduledTaskDefaultOptionV1Rsp {
  code?: number;

  data?: IScheduleTaskDefaultOption;

  message?: string;
}

export interface ISchemaObject {
  base_schema_name?: string;

  comparison_result?: SchemaObjectComparisonResultEnum;

  comparison_schema_name?: string;

  database_diff_objects?: IDatabaseDiffObject[];

  inconsistent_num?: number;
}

export interface ISource {
  sql_source_desc?: string;

  sql_source_ids?: string[];

  sql_source_type?: string;
}

export interface ISqlAnalysis {
  performance_statistics?: IPerformanceStatistics;

  sql_explain?: ISQLExplain;

  table_metas?: ITableMetas;
}

export interface ISqlAnalysisChart {
  points?: IChartPoint[];

  x_info?: string;

  y_info?: string;
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

export interface ISqlDEVRecord {
  audit_result?: IAuditResult[];

  creator?: string;

  first_appear_timestamp?: string;

  fp_count?: number;

  id?: number;

  instance_name?: string;

  last_receive_timestamp?: string;

  schema_name?: string;

  source?: IRecordSource;

  sql?: string;

  sql_fingerprint?: string;
}

export interface ISqlExecutionFailPercent {
  instance_name?: string;

  percent?: number;
}

export interface ISqlFileOrderMethod {
  desc?: string;

  order_method?: string;
}

export interface ISqlFileOrderMethodRes {
  methods?: ISqlFileOrderMethod[];
}

export interface ISqlManage {
  assignees?: string[];

  audit_result?: IAuditResult[];

  audit_status?: SqlManageAuditStatusEnum;

  endpoints?: string[];

  first_appear_timestamp?: string;

  fp_count?: number;

  id?: number;

  instance_name?: string;

  last_receive_timestamp?: string;

  priority?: string;

  remark?: string;

  schema_name?: string;

  source?: ISource;

  sql?: string;

  sql_fingerprint?: string;

  status?: SqlManageStatusEnum;
}

export interface ISqlManageAnalysisChartResp {
  code?: number;

  data?: ISqlAnalysisChart;

  message?: string;
}

export interface ISqlManageCodingReq {
  coding_project_name?: string;

  priority?: SqlManageCodingReqPriorityEnum;

  sql_manage_id_list?: number[];

  type?: SqlManageCodingReqTypeEnum;
}

export interface ISqlVersionDetailResV1 {
  desc?: string;

  sql_version_id?: number;

  sql_version_stage_detail?: ISqlVersionStageDetail[];

  status?: SqlVersionDetailResV1StatusEnum;

  version?: string;
}

export interface ISqlVersionResV1 {
  created_at?: string;

  deletable?: boolean;

  desc?: string;

  lock_time?: string;

  lockable?: boolean;

  status?: SqlVersionResV1StatusEnum;

  version?: string;

  version_id?: number;
}

export interface ISqlVersionStageDetail {
  stage_id?: number;

  stage_instances?: IVersionStageInstance[];

  stage_name?: string;

  stage_sequence?: number;

  workflow_details?: IWorkflowDetailWithInstance[];
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
  cb_operation_logs_expired_hours?: number;

  operation_record_expired_hours?: number;

  url?: string;
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

export interface ITableMetas {
  err_message?: string;

  table_meta_items?: ITableMeta[];
}

export interface ITargetReleaseInstance {
  instance_id?: string;

  instance_schema?: string;

  target_instance_id?: string;

  target_instance_schema?: string;
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

export interface ITestCodingConfigResDataV1 {
  error_message?: string;

  is_message_sent_normally?: boolean;
}

export interface ITestCodingConfigResV1 {
  code?: number;

  data?: ITestCodingConfigResDataV1;

  message?: string;
}

export interface ITestCodingConfigurationReqV1 {
  coding_project_name?: string;
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

export interface ITestWechatConfigResDataV1 {
  error_message?: string;

  is_message_sent_normally?: boolean;
}

export interface ITestWechatConfigResV1 {
  code?: number;

  data?: ITestWechatConfigResDataV1;

  message?: string;
}

export interface ITestWechatConfigurationReqV1 {
  wechat_id?: string;
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

export interface IUpdateAuditPlanStatusReqV1 {
  active?: UpdateAuditPlanStatusReqV1ActiveEnum;
}

export interface IUpdateAuditTaskSQLsReqV1 {
  description?: string;
}

export interface IUpdateAuditWhitelistReqV1 {
  desc?: string;

  match_type?: UpdateAuditWhitelistReqV1MatchTypeEnum;

  value?: string;
}

export interface IUpdateBlacklistReqV1 {
  content?: string;

  desc?: string;

  type?: UpdateBlacklistReqV1TypeEnum;
}

export interface IUpdateCodingConfigurationReqV1 {
  coding_url?: string;

  is_coding_enabled?: boolean;

  token?: string;
}

export interface IUpdateCompanyNoticeReq {
  notice_str?: string;
}

export interface IUpdateCustomRuleReqV1 {
  annotation?: string;

  desc?: string;

  level?: UpdateCustomRuleReqV1LevelEnum;

  rule_script?: string;

  tags?: string[];

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

export interface IUpdateInstanceAuditPlanReqV1 {
  audit_plans?: IAuditPlan[];
}

export interface IUpdateInstanceAuditPlanStatusReqV1 {
  active?: UpdateInstanceAuditPlanStatusReqV1ActiveEnum;
}

export interface IUpdatePipelineReqV1 {
  address?: string;

  description?: string;

  name?: string;

  nodes?: IUpdatePipelineNode[];
}

export interface IUpdateProjectRuleTemplateReqV1 {
  desc?: string;

  rule_list?: IRuleReqV1[];
}

export interface IUpdateReportPushConfigReqV1 {
  enabled?: boolean;

  push_frequency_cron?: string;

  push_user_Type?: UpdateReportPushConfigReqV1PushUserTypeEnum;

  push_user_list?: string[];

  trigger_type?: UpdateReportPushConfigReqV1TriggerTypeEnum;
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

export interface IUpdateSqlBackupStrategyReq {
  strategy?: UpdateSqlBackupStrategyReqStrategyEnum;
}

export interface IUpdateSqlFileOrderV1Req {
  files_to_sort?: IFileToSort[];
}

export interface IUpdateSqlVersionReqV1 {
  desc?: string;

  update_sql_version_stage?: IUpdateSqlVersionStage[];

  version?: string;
}

export interface IUpdateSqlVersionStage {
  name?: string;

  stage_sequence?: number;

  update_stages_instance_dep?: IUpdateStagesInstanceDep[];
}

export interface IUpdateStagesInstanceDep {
  next_stage_instance_id?: string;

  stage_instance_id?: string;
}

export interface IUpdateSystemVariablesReqV1 {
  cb_operation_logs_expired_hours?: number;

  operation_record_expired_hours?: number;

  url?: string;
}

export interface IUpdateTaskBackupStrategyReq {
  strategy?: UpdateTaskBackupStrategyReqStrategyEnum;
}

export interface IUpdateWechatConfigurationReqV1 {
  corp_id?: string;

  corp_secret?: string;

  is_wechat_notification_enabled: boolean;
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

export interface IUserTipResV1 {
  user_id?: string;

  user_name?: string;
}

export interface IVersionStageInstance {
  instance_schema?: string;

  instances_id?: string;

  instances_name?: string;
}

export interface IWechatConfigurationV1 {
  corp_id?: string;

  is_wechat_notification_enabled?: boolean;
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

  instance_info?: IInstanceInfo[];

  project_name?: string;

  project_priority?: string;

  project_uid?: string;

  sql_version_name?: string[];

  status?: WorkflowDetailResV1StatusEnum;

  workflow_id?: string;

  workflow_name?: string;
}

export interface IWorkflowDetailWithInstance {
  desc?: string;

  status?: WorkflowDetailWithInstanceStatusEnum;

  workflow_exec_time?: string;

  workflow_id?: string;

  workflow_instances?: IVersionStageInstance[];

  workflow_name?: string;

  workflow_release_status?: WorkflowDetailWithInstanceWorkflowReleaseStatusEnum;

  workflow_sequence?: number;
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

export interface IWorkflowStatisticOfInstance {
  instance_id?: number;

  unfinished_count?: number;
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

export interface ICreatePipelineResData {
  pipeline_id?: number;
}

export interface IPipelineDetail {
  address?: string;

  description?: string;

  id?: number;

  name?: string;

  node_count?: number;
}

export interface IPipelineDetailData {
  address?: string;

  description?: string;

  id?: number;

  name?: string;

  node_count?: number;

  nodes?: IPipelineNodeDetail[];
}

export interface IPipelineNodeBase {
  audit_method?: pipelineNodeBaseAuditMethodEnum;

  instance_name?: string;

  instance_type?: string;

  name?: string;

  object_path?: string;

  object_type?: pipelineNodeBaseObjectTypeEnum;

  rule_template_name?: string;

  type?: pipelineNodeBaseTypeEnum;
}

export interface IPipelineNodeDetail {
  audit_method?: pipelineNodeDetailAuditMethodEnum;

  id?: number;

  instance_name?: string;

  instance_type?: string;

  integration_info?: string;

  name?: string;

  object_path?: string;

  object_type?: pipelineNodeDetailObjectTypeEnum;

  rule_template_name?: string;

  type?: pipelineNodeDetailTypeEnum;
}

export interface IUpdatePipelineNode {
  audit_method?: updatePipelineNodeAuditMethodEnum;

  id?: number;

  instance_name?: string;

  instance_type?: string;

  name?: string;

  object_path?: string;

  object_type?: updatePipelineNodeObjectTypeEnum;

  rule_template_name?: string;

  type?: updatePipelineNodeTypeEnum;
}

export interface IAssociatedRollbackWorkflow {
  status?: AssociatedRollbackWorkflowStatusEnum;

  workflow_id?: string;

  workflow_name?: string;
}

export interface IAssociatedStageWorkflows {
  sql_version_stage_id?: number;

  stage_sequence?: number;

  status?: AssociatedStageWorkflowsStatusEnum;

  workflow_id?: string;

  workflow_name?: string;
}

export interface IAuditFileExecStatistic {
  exec_result_count?: IExecResultCount;

  file_id?: string;

  file_name?: string;
}

export interface IAuditFileStatistic {
  audit_result_count?: IAuditResultCount;

  exec_order?: number;

  exec_status?: string;

  file_id?: string;

  file_name?: string;
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

  create_user_id?: string;

  rule_template?: IRuleTemplateV2;
}

export interface IAuditPlanSQLReqV2 {
  audit_plan_sql_counter?: string;

  audit_plan_sql_fingerprint?: string;

  audit_plan_sql_last_receive_text?: string;

  audit_plan_sql_last_receive_timestamp?: string;

  audit_plan_sql_schema?: string;

  db_user?: string;

  endpoints?: string[];

  first_query_at?: string;

  query_time_avg?: number;

  query_time_max?: number;

  row_examined_avg?: number;
}

export interface IAuditResDataV2 {
  audit_level?: AuditResDataV2AuditLevelEnum;

  pass_rate?: number;

  score?: number;

  sql_results?: IAuditSQLResV2[];
}

export interface IAuditResultCount {
  error_sql_count?: number;

  normal_sql_count?: number;

  notice_sql_count?: number;

  warning_sql_count?: number;
}

export interface IAuditSQLResV2 {
  audit_level?: string;

  audit_result?: IAuditResult[];

  exec_sql?: string;

  number?: number;
}

export interface IAuditTaskSQLResV2 {
  associated_rollback_workflows?: IAssociatedRollbackWorkflow[];

  audit_level?: string;

  audit_result?: IAuditResult[];

  audit_status?: string;

  backup_result?: string;

  backup_status?: AuditTaskSQLResV2BackupStatusEnum;

  backup_strategy?: AuditTaskSQLResV2BackupStrategyEnum;

  backup_strategy_tip?: string;

  description?: string;

  exec_result?: string;

  exec_sql?: string;

  exec_sql_id?: number;

  exec_status?: string;

  number?: number;

  rollback_sqls?: string[];

  sql_source_file?: string;

  sql_start_line?: number;

  sql_type?: string;
}

export interface IBatchCancelWorkflowsReqV2 {
  workflow_id_list?: string[];
}

export interface IBatchCompleteWorkflowsReqV2 {
  workflow_id_list?: string[];
}

export interface ICreateWorkflowReqV2 {
  desc?: string;

  sql_version_id?: number;

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

  project_id?: string;

  rule_template_name?: string;

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

export interface IExecResultCount {
  doing_count?: number;

  failed_count?: number;

  initialized_count?: number;

  manually_executed_count?: number;

  succeeded_count?: number;

  terminate_failed_count?: number;

  terminate_succeeded_count?: number;
}

export interface IFullSyncAuditPlanSQLsReqV2 {
  audit_plan_sql_list?: IAuditPlanSQLReqV2[];

  error_message?: string;
}

export interface IGetAuditFileExecStatisticRes {
  code?: number;

  data?: IAuditFileExecStatistic;

  message?: string;
}

export interface IGetAuditFileListRes {
  code?: number;

  data?: IAuditFileStatistic[];

  message?: string;

  total_nums?: number;
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

export interface IPartialSyncAuditPlanSQLsReqV2 {
  audit_plan_sql_list?: IAuditPlanSQLReqV2[];
}

export interface IRejectWorkflowReqV2 {
  reason?: string;
}

export interface IRuleTemplateV2 {
  is_global_rule_template?: boolean;

  name?: string;
}

export interface ISqlVersion {
  sql_version_id?: number;

  sql_version_name?: string;
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
  is_notify?: boolean;

  notify_type?: UpdateWorkflowScheduleReqV2NotifyTypeEnum;

  schedule_time?: string;
}

export interface IUploadInstanceAuditPlanSQLsReqV2 {
  audit_plan_sql_list?: IAuditPlanSQLReqV2[];

  error_message?: string;
}

export interface IWorkflowRecordResV2 {
  current_step_number?: number;

  executable?: boolean;

  executable_reason?: string;

  status?: WorkflowRecordResV2StatusEnum;

  tasks?: IWorkflowTaskItem[];

  workflow_step_list?: IWorkflowStepResV2[];
}

export interface IWorkflowResV2 {
  associated_rollback_workflows?: IAssociatedRollbackWorkflow[];

  associated_stage_workflows?: IAssociatedStageWorkflows[];

  create_time?: string;

  create_user_name?: string;

  desc?: string;

  exec_mode?: WorkflowResV2ExecModeEnum;

  mode?: WorkflowResV2ModeEnum;

  record?: IWorkflowRecordResV2;

  record_history_list?: IWorkflowRecordResV2[];

  sql_version?: ISqlVersion;

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

export interface IBatchCompleteWorkflowsReqV3 {
  workflow_list?: ICompleteWorkflowReq[];
}

export interface ICompleteWorkflowReq {
  desc?: string;

  workflow_id?: string;
}
