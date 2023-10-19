import { ICustomRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { CustomRuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FormInstance } from 'antd';

export type CustomRuleFormBaseInfoFields = {
  annotation: string;
  desc: string;
  dbType: string;
  ruleType: string;
  level?: CustomRuleResV1LevelEnum;
};

export type EditRuleScriptFields = {
  script: string;
};

export type CustomRuleFormProps = {
  title: string;
  form: FormInstance<CustomRuleFormBaseInfoFields>;
  editScriptForm: FormInstance<EditRuleScriptFields>;
  defaultData?: ICustomRuleResV1;
  step: number;
  prevStep: () => void;
  extraRuleTypeList: string[];
  extraRuleName: string;
  resetExtraInfo: () => void;
  onExtraRuleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submit: () => void;
  baseInfoSubmit: () => void;
  submitLoading: boolean;
};

export type BaseInfoFormProps = {
  submit: () => void;
} & Pick<
  CustomRuleFormProps,
  | 'form'
  | 'defaultData'
  | 'extraRuleTypeList'
  | 'extraRuleName'
  | 'resetExtraInfo'
  | 'onExtraRuleNameChange'
>;

export type EditRuleScriptProps = {
  form: FormInstance<EditRuleScriptFields>;
} & Pick<
  CustomRuleFormProps,
  'prevStep' | 'submit' | 'submitLoading' | 'defaultData'
>;
