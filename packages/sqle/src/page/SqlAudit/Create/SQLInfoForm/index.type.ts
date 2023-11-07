import { FormInstance, SelectProps } from 'antd5';

export enum AuditTypeEnum {
  static,
  dynamic
}

export enum UploadTypeEnum {
  sql,
  sqlFile,
  xmlFile,
  zipFile,
  git
}

export type SQLStatementFields = {
  sql: string;
  sqlFile: File[];
  xmlFile: File[];
  zipFile: File[];
};

export type SQLInfoFormFields = {
  auditType: AuditTypeEnum;
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

export type SQLInfoFormProps = {
  form: FormInstance<SQLInfoFormFields>;
  submit: (values: SQLInfoFormFields) => Promise<void>;
};

export type SQLInfoFormItemProps = SQLInfoFormProps;

export type DatabaseInfoProps = Pick<SQLInfoFormItemProps, 'form'> &
  Pick<SQLInfoFormFields, 'auditType'> & {
    instanceLoading: boolean;
    instanceOptions: SelectProps['options'];
  };

export type SQLStatementFormProps = Pick<SQLInfoFormItemProps, 'form'>;

export type SqlUploadFileContProps = Pick<SQLInfoFormItemProps, 'form'>;
