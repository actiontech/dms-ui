import { IEnumsValueResV1 } from '../../api/sqle/service/common';

export type BackendFormItemParams = {
  desc?: string;
  key?: string;
  type?: string;
  value?: string;
  enums_value?: IEnumsValueResV1[];
  hidden?: boolean;
};

export type BackendFormRequestParams = {
  key?: string;
  value?: string;
};

export type BackendFormValues = {
  [key: string]: string | boolean;
};

export type BackendFormProps = {
  params: BackendFormItemParams[];
  paramsKey?: string;
  disabled?: boolean;
  isFullLine?: boolean;
  formMode?: 'update' | 'create';
};
