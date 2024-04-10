import { AuditPlanParamResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type FormItem = {
  desc?: string;
  key?: string;
  type?: AuditPlanParamResV1TypeEnum;
  value?: string;
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
