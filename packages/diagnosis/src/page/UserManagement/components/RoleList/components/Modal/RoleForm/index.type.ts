import { FormInstance } from 'antd';

export interface IRoleFormFieldProps {
  role_desc?: string;
  role_name?: string;
  scopes?: string[];
}

export interface IRoleFormProps {
  form: FormInstance;
  visible: boolean;
  isUpdate?: boolean;
}
