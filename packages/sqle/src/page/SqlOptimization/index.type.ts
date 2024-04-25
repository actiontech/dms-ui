import { FormInstance, SelectProps } from 'antd';
import { UploadTypeEnum } from '../SqlAudit/Create/SQLInfoForm/index.type';

export type BaseFormFields = {
  optimizationName: string;
};

export type BaseForm = FormInstance<BaseFormFields>;

export type SqlInfoFormFields = {
  name: string;
  uploadType: UploadTypeEnum;
  sql: string;
  sqlFile: File[];
  mybatisFile: File[];
  zipFile: File[];
  instanceName: string;
  instanceSchema: string;
  dbType: string;
  gitHttpUrl: string;
  gitUserName: string;
  gitUserPassword: string;
};

export type SqlInfoForm = FormInstance<SqlInfoFormFields>;

export type SqlInfoFormProps = {
  form: FormInstance<SqlInfoFormFields>;
  submit: () => void;
};

export type DatabaseInfoProps = {
  form: FormInstance<SqlInfoFormFields>;
  instanceLoading: boolean;
  instanceOptions: SelectProps['options'];
};

export type SqlOptimizationOverviewUrlParams = { optimizationId: string };

export type SqlOptimizationDetailUrlParams = {
  number: string;
} & SqlOptimizationOverviewUrlParams;
