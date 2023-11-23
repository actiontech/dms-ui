import { FormInstance } from 'antd';
import { RuleTemplateFormProps } from '../index.type';
import { IRuleProjectTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type RuleTemplateBaseInfoFields = {
  templateName: string;
  templateDesc?: string;
  db_type: string;
};

export type RuleTemplateBaseInfoFormProps = {
  form: FormInstance<RuleTemplateBaseInfoFields>;
  defaultData?: IRuleProjectTemplateDetailResV1;
  submit: () => void;
  submitLoading?: boolean;
  projectName: string;
  mode: RuleTemplateFormProps['mode'];
};
