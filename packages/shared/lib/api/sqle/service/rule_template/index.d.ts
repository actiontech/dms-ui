import {
  IGetCustomRulesResV1,
  ICreateCustomRuleReqV1,
  IBaseRes,
  IGetRuleTypeByDBTypeResV1,
  IGetCustomRuleResV1,
  IUpdateCustomRuleReqV1,
  IGetRuleTemplateTipsResV1,
  IGetProjectRuleTemplatesResV1,
  ICreateProjectRuleTemplateReqV1,
  IGetProjectRuleTemplateResV1,
  IUpdateProjectRuleTemplateReqV1,
  ICloneProjectRuleTemplateReqV1,
  IGetRuleKnowledgeResV1,
  IUpdateRuleKnowledgeReq,
  IGetRuleTemplatesResV1,
  ICreateRuleTemplateReqV1,
  IParseProjectRuleTemplateFileResV1,
  IGetRuleTemplateResV1,
  IUpdateRuleTemplateReqV1,
  ICloneRuleTemplateReqV1,
  IGetRulesResV1,
  IGetRuleCategoryStatisticResV1,
  IGetDriverRuleVersionTipsResV1
} from '../common.d';

import {
  getRuleTemplateFileV1FileTypeEnum,
  exportProjectRuleTemplateV1ExportTypeEnum,
  importProjectRuleTemplateV1FileTypeEnum,
  exportRuleTemplateV1ExportTypeEnum
} from './index.enum';

export interface IGetCustomRulesV1Params {
  filter_db_type?: string;

  filter_desc?: string;
}

export interface IGetCustomRulesV1Return extends IGetCustomRulesResV1 {}

export interface ICreateCustomRuleV1Params extends ICreateCustomRuleReqV1 {}

export interface ICreateCustomRuleV1Return extends IBaseRes {}

export interface IGetRuleTypeByDBTypeV1Params {
  db_type: string;
}

export interface IGetRuleTypeByDBTypeV1Return
  extends IGetRuleTypeByDBTypeResV1 {}

export interface IGetCustomRuleV1Params {
  rule_id: string;
}

export interface IGetCustomRuleV1Return extends IGetCustomRuleResV1 {}

export interface IDeleteCustomRuleV1Params {
  rule_id: string;
}

export interface IDeleteCustomRuleV1Return extends IBaseRes {}

export interface IUpdateCustomRuleV1Params extends IUpdateCustomRuleReqV1 {
  rule_id: string;
}

export interface IUpdateCustomRuleV1Return extends IBaseRes {}

export interface IGetRuleTemplateFileV1Params {
  instance_type: string;

  file_type: getRuleTemplateFileV1FileTypeEnum;
}

export interface IGetProjectRuleTemplateTipsV1Params {
  project_name: string;

  filter_db_type?: string;
}

export interface IGetProjectRuleTemplateTipsV1Return
  extends IGetRuleTemplateTipsResV1 {}

export interface IGetProjectRuleTemplateListV1Params {
  project_name: string;

  page_index: number;

  page_size: number;
}

export interface IGetProjectRuleTemplateListV1Return
  extends IGetProjectRuleTemplatesResV1 {}

export interface ICreateProjectRuleTemplateV1Params
  extends ICreateProjectRuleTemplateReqV1 {
  project_name: string;
}

export interface ICreateProjectRuleTemplateV1Return extends IBaseRes {}

export interface IGetProjectRuleTemplateV1Params {
  project_name: string;

  rule_template_name: string;

  fuzzy_keyword_rule?: string;

  tags?: string;
}

export interface IGetProjectRuleTemplateV1Return
  extends IGetProjectRuleTemplateResV1 {}

export interface IDeleteProjectRuleTemplateV1Params {
  project_name: string;

  rule_template_name: string;
}

export interface IDeleteProjectRuleTemplateV1Return extends IBaseRes {}

export interface IUpdateProjectRuleTemplateV1Params
  extends IUpdateProjectRuleTemplateReqV1 {
  project_name: string;

  rule_template_name: string;
}

export interface IUpdateProjectRuleTemplateV1Return extends IBaseRes {}

export interface ICloneProjectRuleTemplateV1Params
  extends ICloneProjectRuleTemplateReqV1 {
  project_name: string;

  rule_template_name: string;
}

export interface ICloneProjectRuleTemplateV1Return extends IBaseRes {}

export interface IExportProjectRuleTemplateV1Params {
  project_name: string;

  rule_template_name: string;

  export_type: exportProjectRuleTemplateV1ExportTypeEnum;
}

export interface IGetCustomRuleKnowledgeV1Params {
  rule_name: string;

  db_type: string;
}

export interface IGetCustomRuleKnowledgeV1Return
  extends IGetRuleKnowledgeResV1 {}

export interface IUpdateCustomRuleKnowledgeParams
  extends IUpdateRuleKnowledgeReq {
  rule_name: string;

  db_type: string;
}

export interface IUpdateCustomRuleKnowledgeReturn extends IBaseRes {}

export interface IGetRuleKnowledgeV1Params {
  rule_name: string;

  db_type: string;
}

export interface IGetRuleKnowledgeV1Return extends IGetRuleKnowledgeResV1 {}

export interface IUpdateRuleKnowledgeParams extends IUpdateRuleKnowledgeReq {
  rule_name: string;

  db_type: string;
}

export interface IUpdateRuleKnowledgeReturn extends IBaseRes {}

export interface IGetRuleTemplateTipsV1Params {
  filter_db_type?: string;
}

export interface IGetRuleTemplateTipsV1Return
  extends IGetRuleTemplateTipsResV1 {}

export interface IGetRuleTemplateListV1Params {
  page_index: number;

  page_size: number;
}

export interface IGetRuleTemplateListV1Return extends IGetRuleTemplatesResV1 {}

export interface ICreateRuleTemplateV1Params extends ICreateRuleTemplateReqV1 {}

export interface ICreateRuleTemplateV1Return extends IBaseRes {}

export interface IImportProjectRuleTemplateV1Params {
  file_type: importProjectRuleTemplateV1FileTypeEnum;

  rule_template_file: any;
}

export interface IImportProjectRuleTemplateV1Return
  extends IParseProjectRuleTemplateFileResV1 {}

export interface IGetRuleTemplateV1Params {
  rule_template_name: string;

  fuzzy_keyword_rule?: string;

  tags?: string;
}

export interface IGetRuleTemplateV1Return extends IGetRuleTemplateResV1 {}

export interface IDeleteRuleTemplateV1Params {
  rule_template_name: string;
}

export interface IDeleteRuleTemplateV1Return extends IBaseRes {}

export interface IUpdateRuleTemplateV1Params extends IUpdateRuleTemplateReqV1 {
  rule_template_name: string;
}

export interface IUpdateRuleTemplateV1Return extends IBaseRes {}

export interface ICloneRuleTemplateV1Params extends ICloneRuleTemplateReqV1 {
  rule_template_name: string;
}

export interface ICloneRuleTemplateV1Return extends IBaseRes {}

export interface IExportRuleTemplateV1Params {
  export_type: exportRuleTemplateV1ExportTypeEnum;

  rule_template_name: string;
}

export interface IGetRuleListV1Params {
  filter_db_type?: string;

  fuzzy_keyword_rule?: string;

  filter_global_rule_template_name?: string;

  filter_rule_names?: string;

  filter_rule_version?: number;

  tags?: string;
}

export interface IGetRuleListV1Return extends IGetRulesResV1 {}

export interface IGetCategoryStatisticsReturn
  extends IGetRuleCategoryStatisticResV1 {}

export interface IGetDriverRuleVersionTipsReturn
  extends IGetDriverRuleVersionTipsResV1 {}
