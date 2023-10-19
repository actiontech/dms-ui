import { FormInstance } from 'antd5';
import { IRuleTemplateV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { SQLStatementFields } from '../../SQLStatementForm';
import { CreateOrderFormStateType } from '../index.type';
import { OrderBaseInfoFormFields } from '../BaseInfoForm/index.type';
import { Key } from 'react';

export type SQLInfoFormProps = {
  form: FormInstance<SQLInfoFormFields>;
  submit: (
    values: SQLInfoFormFields,
    baseInfo?: OrderBaseInfoFormFields
  ) => Promise<void>;
  instanceNameChange: (name: string) => void;
  projectName: string;
  projectID: string;
} & CreateOrderFormStateType;

export type DatabaseInfoFields = {
  instanceName: string;
  instanceSchema: string;
};

export type SQLInfoFormFields = {
  isSameSqlOrder: boolean;
  dataBaseInfo: Array<DatabaseInfoFields>;
  [key: string]: SQLStatementFields | boolean | Array<DatabaseInfoFields>;
};

export type DatabaseInfoProps = Pick<
  SQLInfoFormItemProps,
  | 'form'
  | 'instanceNameChange'
  | 'projectName'
  | 'projectID'
  | 'setInstanceInfo'
  | 'schemaList'
  | 'setSchemaList'
  | 'ruleTemplates'
  | 'setRuleTemplates'
> & {
  setChangeSqlModeDisabled: (disabled: boolean) => void;
};
export type SQLContentFields = Pick<
  SQLStatementFields,
  'sql' | 'sqlFile' | 'mybatisFile'
>;

export type SameSqlModeProps = {
  submit: (values: SQLContentFields, currentTabIndex: number) => void;
  submitLoading: boolean;
  currentTabIndex: number;
  formValueChange: () => void;
};

export type DifferenceSqlModeProps = Omit<
  SameSqlModeProps,
  'currentTabIndex'
> & {
  instanceNameList: string[];
};

export type InstanceInfoType = Map<
  Key,
  { instanceName: string; instanceSchemaName?: string }
>;
export type SchemaListType = Map<number, string[]>;
export type RuleTemplateListType = Map<number, IRuleTemplateV2 | undefined>;

export type SQLInfoFormItemProps = SQLInfoFormProps;

export type RuleTemplateLinkButtonProps = {
  value?: { isGlobal?: boolean; name?: string };
  onChange?: (value: { isGlobal: boolean; name: string }) => void;
  projectID: string;
};
