import { importProjectRuleTemplateV1FileTypeEnum } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.enum';

export type SelectFileFormFields = {
  ruleTemplateFile: any;
  fileType: importProjectRuleTemplateV1FileTypeEnum;
};

export type FileUploadCheckStatusType = {
  success: boolean;
  errorMessage?: string;
};
