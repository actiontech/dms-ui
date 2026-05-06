import {
  IListMaskingRulesReply,
  IListPendingApprovalRequestsReply,
  IGetPlaintextAccessRequestDetailReply,
  IProcessApprovalRequestReq,
  IProcessApprovalRequestReply,
  IGetMaskingOverviewTreeReply,
  IConfigureMaskingRulesReq,
  IConfigureMaskingRulesReply,
  IListSensitiveDataDiscoveryTasksReply,
  IAddSensitiveDataDiscoveryTaskReq,
  IAddSensitiveDataDiscoveryTaskReply,
  IListCreatableDBServicesForMaskingTaskReply,
  IUpdateSensitiveDataDiscoveryTaskReq,
  IUpdateSensitiveDataDiscoveryTaskReply,
  IDeleteSensitiveDataDiscoveryTaskReply,
  IListSensitiveDataDiscoveryTaskHistoriesReply,
  IGetTableColumnMaskingDetailsReply,
  IListMaskingTemplatesReply,
  IAddMaskingTemplateReq,
  IAddMaskingTemplateReply,
  IUpdateMaskingTemplateReq,
  IUpdateMaskingTemplateReply,
  IDeleteMaskingTemplateReply
} from '../common.d';

import { GetMaskingOverviewTreeMaskingConfigStatusesEnum } from './index.enum';

export interface IListMaskingRulesReturn extends IListMaskingRulesReply {}

export interface IListPendingApprovalRequestsParams {
  project_uid: string;

  page_size?: number;

  page_index?: number;
}

export interface IListPendingApprovalRequestsReturn
  extends IListPendingApprovalRequestsReply {}

export interface IGetPlaintextAccessRequestDetailParams {
  project_uid: string;

  request_id: number;
}

export interface IGetPlaintextAccessRequestDetailReturn
  extends IGetPlaintextAccessRequestDetailReply {}

export interface IProcessApprovalRequestParams
  extends IProcessApprovalRequestReq {
  project_uid: string;

  request_id: number;
}

export interface IProcessApprovalRequestReturn
  extends IProcessApprovalRequestReply {}

export interface IGetMaskingOverviewTreeParams {
  project_uid: string;

  db_service_uid: string;

  keywords?: string;

  masking_config_statuses?: GetMaskingOverviewTreeMaskingConfigStatusesEnum;
}

export interface IGetMaskingOverviewTreeReturn
  extends IGetMaskingOverviewTreeReply {}

export interface IConfigureMaskingRulesParams
  extends IConfigureMaskingRulesReq {
  project_uid: string;
}

export interface IConfigureMaskingRulesReturn
  extends IConfigureMaskingRulesReply {}

export interface IListSensitiveDataDiscoveryTasksParams {
  project_uid: string;

  page_size?: number;

  page_index?: number;
}

export interface IListSensitiveDataDiscoveryTasksReturn
  extends IListSensitiveDataDiscoveryTasksReply {}

export interface IAddSensitiveDataDiscoveryTaskParams
  extends IAddSensitiveDataDiscoveryTaskReq {
  project_uid: string;
}

export interface IAddSensitiveDataDiscoveryTaskReturn
  extends IAddSensitiveDataDiscoveryTaskReply {}

export interface IListCreatableDBServicesForMaskingTaskParams {
  project_uid: string;

  page_size?: number;

  page_index?: number;

  keywords?: string;
}

export interface IListCreatableDBServicesForMaskingTaskReturn
  extends IListCreatableDBServicesForMaskingTaskReply {}

export interface IUpdateSensitiveDataDiscoveryTaskParams
  extends IUpdateSensitiveDataDiscoveryTaskReq {
  project_uid: string;

  task_id: number;
}

export interface IUpdateSensitiveDataDiscoveryTaskReturn
  extends IUpdateSensitiveDataDiscoveryTaskReply {}

export interface IDeleteSensitiveDataDiscoveryTaskParams {
  project_uid: string;

  task_id: number;
}

export interface IDeleteSensitiveDataDiscoveryTaskReturn
  extends IDeleteSensitiveDataDiscoveryTaskReply {}

export interface IListSensitiveDataDiscoveryTaskHistoriesParams {
  project_uid: string;

  task_id: number;

  page_size?: number;

  page_index?: number;
}

export interface IListSensitiveDataDiscoveryTaskHistoriesReturn
  extends IListSensitiveDataDiscoveryTaskHistoriesReply {}

export interface IGetTableColumnMaskingDetailsParams {
  project_uid: string;

  table_id: number;

  keywords?: string;
}

export interface IGetTableColumnMaskingDetailsReturn
  extends IGetTableColumnMaskingDetailsReply {}

export interface IListMaskingTemplatesParams {
  project_uid: string;

  page_size?: number;

  page_index?: number;
}

export interface IListMaskingTemplatesReturn
  extends IListMaskingTemplatesReply {}

export interface IAddMaskingTemplateParams extends IAddMaskingTemplateReq {
  project_uid: string;
}

export interface IAddMaskingTemplateReturn extends IAddMaskingTemplateReply {}

export interface IUpdateMaskingTemplateParams
  extends IUpdateMaskingTemplateReq {
  project_uid: string;

  template_id: number;
}

export interface IUpdateMaskingTemplateReturn
  extends IUpdateMaskingTemplateReply {}

export interface IDeleteMaskingTemplateParams {
  project_uid: string;

  template_id: number;
}

export interface IDeleteMaskingTemplateReturn
  extends IDeleteMaskingTemplateReply {}

export interface IListMaskingRulesV2Params {
  project_uid: string;

  source?: string;

  keywords?: string;

  page_size?: number;

  page_index?: number;
}

export interface IListMaskingRulesV2Data {
  id?: number;

  name?: string;

  source?: string;

  sensitive_type_name?: string;

  sensitive_type_info?: string;

  is_custom_type?: boolean;

  algorithm_type?: string;

  description?: string;

  effect?: string;

  effect_example_before?: string;

  effect_example_after?: string;
}

export interface IListMaskingRulesV2Return {
  code?: number;

  message?: string;

  data?: IListMaskingRulesV2Data[];

  total_nums?: number;
}

export interface ICustomRuleMaskingAlgorithm {
  masking_algorithm_name: string;

  mask_type: string;

  value?: string;

  offset?: number;

  padding?: number;

  length?: number;

  reverse?: boolean;

  ignore_char_set?: string;
}

export interface IAddCustomMaskingRuleParams {
  project_uid: string;

  rule: {
    name: string;
    description?: string;
    sensitive_data_type_uid: string;
    masking_algorithm_config: ICustomRuleMaskingAlgorithm;
  };
}

export interface IAddCustomMaskingRuleReturn {
  code?: number;

  message?: string;

  data?: {
    rule_id?: number;
  };
}

export interface IUpdateCustomMaskingRuleParams {
  project_uid: string;

  rule_id: number;

  rule: {
    name: string;
    description?: string;
    masking_algorithm_config?: ICustomRuleMaskingAlgorithm;
  };
}

export interface IUpdateCustomMaskingRuleReturn {
  code?: number;

  message?: string;
}

export interface IDeleteCustomMaskingRuleParams {
  project_uid: string;

  rule_id: number;
}

export interface IDeleteCustomMaskingRuleReturn {
  code?: number;

  message?: string;
}

export interface IListSensitiveTypesParams {
  project_uid: string;
}

export interface ISensitiveTypeData {
  id?: number;

  sensitive_data_type_source?: string;

  en_identifier?: string;

  cn_name?: string;

  field_keywords?: string[];

  sample_data_regex_list?: string[];

  sample_data_list?: string[];

  rule_count?: number;
}

export interface IListSensitiveTypesReturn {
  code?: number;

  message?: string;

  data?: ISensitiveTypeData[];
}

export interface IPreviewMaskingEffectParams {
  project_uid: string;

  sample_input_list: string[];

  masking_algorithm_config: ICustomRuleMaskingAlgorithm;
}

export interface IPreviewMaskingEffectReturn {
  code?: number;

  message?: string;

  data?: {
    masked_output_list?: string[];
  };
}

export interface IGetMaskingRuleDetailParams {
  project_uid: string;

  rule_id: number;
}

export interface IGetMaskingRuleDetailData {
  rule_id?: number;

  name?: string;

  description?: string;

  sensitive_data_type?: ISensitiveTypeData;

  masking_algorithm_config?: ICustomRuleMaskingAlgorithm;
}

export interface IGetMaskingRuleDetailReturn {
  code?: number;

  message?: string;

  data?: IGetMaskingRuleDetailData;
}

export interface INewCustomSensitiveType {
  cn_name: string;

  en_identifier: string;

  field_keywords?: string[];

  sample_data_regex_list?: string[];

  sample_data_list?: string[];
}

export interface IAddSensitiveDataTypeParams {
  project_uid: string;

  type: INewCustomSensitiveType;
}

export interface IAddSensitiveDataTypeReturn {
  code?: number;

  message?: string;

  data?: {
    sensitive_data_type_id?: number;
  };
}

export interface IUpdateSensitiveDataTypeData {
  field_keywords?: string[];

  sample_data_regex_list?: string[];

  sample_data_list?: string[];
}

export interface IUpdateSensitiveDataTypeParams {
  project_uid: string;

  sensitive_data_type_id: number;

  type: IUpdateSensitiveDataTypeData;
}

export interface IUpdateSensitiveDataTypeReturn {
  code?: number;

  message?: string;
}

export interface IDeleteSensitiveDataTypeParams {
  project_uid: string;

  sensitive_data_type_id: number;
}

export interface IDeleteSensitiveDataTypeReturn {
  code?: number;

  message?: string;
}

export interface ITestSensitiveDataTypeMatchParams {
  project_uid: string;

  sensitive_data_type_id?: number;

  field_keywords?: string[];

  sample_data_regex_list?: string[];

  sample_values: string[];
}

export interface ISensitiveDataTypeMatchResult {
  value?: string;

  matched?: boolean;
}

export interface ITestSensitiveDataTypeMatchReturn {
  code?: number;

  message?: string;

  data?: {
    results?: ISensitiveDataTypeMatchResult[];
  };
}

export interface IListDBServiceSchemasForMaskingTaskParams {
  project_uid: string;

  db_service_uid: string;
}

export interface IDBServiceSchemaData {
  name?: string;
}

export interface IListDBServiceSchemasForMaskingTaskReturn {
  code?: number;

  message?: string;

  data?: IDBServiceSchemaData[];
}

export interface IListDBServiceTablesForMaskingTaskParams {
  project_uid: string;

  db_service_uid: string;

  schema_name: string;
}

export interface IDBServiceTableData {
  name?: string;
}

export interface IListDBServiceTablesForMaskingTaskReturn {
  code?: number;

  message?: string;

  data?: IDBServiceTableData[];
}
