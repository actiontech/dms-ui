import { IEnumsValue } from '@actiontech/shared/lib/api/sqle/service/common';

export type FormItem = {
  desc?: string;
  key?: string;
  type?: string;
  value?: string;
  enums_value?: IEnumsValue[];
};

export type BackendFormRequestParams = {
  key?: string;
  value?: string;
};

export type BackendFormValues = {
  [key: string]: string | boolean;
};

export type BackendFormProps = {
  params: FormItem[];
  paramsKey?: string;
  disabled?: boolean;
  isFullLine?: boolean;
  formMode?: 'update' | 'create';
};

export { default } from './AutoCreatedFormItemByApi';
