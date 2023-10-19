export type FormItem = {
  desc?: string;
  key?: string;
  type?: string;
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
};

export { default } from './BackendForm';
