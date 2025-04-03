import { FormInstance, SelectProps } from 'antd';
import { GitProtocolType } from '../SQLStatementForm/components/RepositoryConfig/index.type';

export enum AuditTypeEnum {
  static,
  dynamic
}

export enum UploadTypeEnum {
  sql,
  sqlFile,
  mybatisFile,
  zipFile,
  git
}

export type SQLStatementFields = {
  sql: string;
  sqlFile: File[];
  mybatisFile: File[];
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
  ruleTemplate: string;
  dbType: string;
  gitHttpUrl: string;
  gitUserName: string;
  gitUserPassword: string;
  gitBranch: string;
  gitProtocol: GitProtocolType;
};

export type SQLInfoFormProps = {
  form: FormInstance<SQLInfoFormFields>;
  submit: (values: SQLInfoFormFields) => Promise<void>;
  setAuditLoading: (submitStatus: boolean) => void;
};

export type SQLInfoFormItemProps = SQLInfoFormProps;

export type DatabaseInfoProps = Pick<SQLInfoFormItemProps, 'form'> &
  Pick<SQLInfoFormFields, 'auditType'> & {
    instanceLoading: boolean;
    instanceOptions: SelectProps['options'];
  };

export type SQLStatementFormProps = Pick<SQLInfoFormItemProps, 'form'>;

export type SqlUploadFileContProps = Pick<SQLInfoFormItemProps, 'form'>;
