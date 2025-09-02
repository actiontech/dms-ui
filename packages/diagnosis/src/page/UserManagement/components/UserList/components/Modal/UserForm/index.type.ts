import { FormInstance } from 'antd';

export interface IUserFormField {
  username: string;
  isNeedUpdatePassword?: boolean;
  password?: string;
  confirmPassword?: string;
  role_id: string;
}

export interface IUserFormProps {
  form: FormInstance;
  visible: boolean;
  isUpdate?: boolean;
  isAdmin?: boolean;
}
