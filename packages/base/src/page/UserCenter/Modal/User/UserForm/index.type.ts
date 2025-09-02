import { FormInstance } from 'antd';

export interface IUserFormFields {
  username: string;
  password: string;
  passwordConfirm: string;
  needUpdatePassWord?: boolean;
  opPermissionUids?: string[];
  isDisabled: boolean;
}

export interface IUserFormProps {
  form: FormInstance<IUserFormFields>;
  visible: boolean;
  isUpdate?: boolean;
  isAdmin?: boolean;
}
