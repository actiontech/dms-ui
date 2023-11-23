import { FormInstance } from 'antd';

export type SqlAuditBaseInfoFormFields = {
  tags: string[];
};

export type SqlAuditBaseInfoFormProps = {
  form: FormInstance<SqlAuditBaseInfoFormFields>;
};
