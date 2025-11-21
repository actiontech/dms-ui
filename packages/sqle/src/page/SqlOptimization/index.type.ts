import { FormInstance, SelectProps } from 'antd';

export enum OptimizationTypeEnum {
  online = 'online',
  offline = 'offline'
}

export enum UploadTypeEnum {
  sql,
  sqlFile,
  mybatisFile,
  zipFile,
  git
}

export type BaseFormFields = {
  optimizationName: string;
};

export type BaseForm = FormInstance<BaseFormFields>;

export type SqlInfoFormFields = {
  name: string;
  optimizationType: OptimizationTypeEnum;
  uploadType: UploadTypeEnum;
  sql: string;
  originSql: string;
  sqlFile: File[];
  mybatisFile: File[];
  zipFile: File[];
  instanceName: string;
  instanceSchema: string;
  dbType: string;
  formatted?: boolean;
  gitHttpUrl: string;
  gitUserName: string;
  gitUserPassword: string;
  // 离线调优专用字段
  offlineSql?: string;
  executionPlan?: string;
  tableStructure?: string;
  enableHighAnalysis?: boolean;
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
  getInstanceDbType: (instanceName: string) => string;
};

export type SQLStatementFormProps = Pick<SqlInfoFormProps, 'form'> & {
  isReadOnlyMode?: boolean;
};

export type SQLStatementFields = {
  sql: string;
  sqlFile: File[];
  mybatisFile: File[];
  zipFile: File[];
};

export type TypeUploadKeys = keyof typeof UploadTypeEnum;

export const SQLUploadTypeKeys: TypeUploadKeys[] = Object.keys(
  UploadTypeEnum
).filter((key) => isNaN(parseInt(key))) as TypeUploadKeys[];
