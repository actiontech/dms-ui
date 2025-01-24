import { ICustomRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { CustomRuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FormInstance } from 'antd';

export type CustomRuleFormBaseInfoFields = {
  annotation: string;
  desc: string;
  dbType: string;
  level?: CustomRuleResV1LevelEnum;
  operand: string[];
  sql: string;
  auditPurpose: string;
  auditAccuracy: string;
  performanceCost?: string;
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
  submit: () => void;
  baseInfoSubmit: () => void;
  submitLoading: boolean;
};

export type BaseInfoFormProps = {
  submit: () => void;
} & Pick<CustomRuleFormProps, 'form' | 'defaultData'>;

export type EditRuleScriptProps = {
  form: FormInstance<EditRuleScriptFields>;
} & Pick<
  CustomRuleFormProps,
  'prevStep' | 'submit' | 'submitLoading' | 'defaultData'
>;
