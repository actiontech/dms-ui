import { FormInstance } from 'antd5';

export type SqlAuditBaseInfoFormFields = {
  tags: string[];
};

export type SqlAuditBaseInfoFormProps = {
  form: FormInstance<SqlAuditBaseInfoFormFields>;
};
