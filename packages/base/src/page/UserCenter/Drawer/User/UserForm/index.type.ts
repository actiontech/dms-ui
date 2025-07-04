import { FormInstance } from 'antd';

export interface IUserFormFields {
  username: string;
  password: string;
  passwordConfirm: string;
  needUpdatePassWord?: boolean;
  email?: string;
  phone?: string;
  wxid?: string;
  opPermissionUid?: string;
  isDisabled: boolean;
}

export interface IUserFormProps {
  form: FormInstance<IUserFormFields>;
  visible: boolean;
  isUpdate?: boolean;
  isAdmin?: boolean;
}
