import { FormInstance } from 'antd5';

export interface IUserFormFields {
  username: string;
  password: string;
  passwordConfirm: string;
  needUpdatePassWord?: boolean;
  email?: string;
  phone?: string;
  wxid?: string;
  userGroupUids?: string[];
  opPermissionUids?: string[];
  isDisabled: boolean;
}

export interface IUserFormProps {
  form: FormInstance<IUserFormFields>;
  visible: boolean;
  isUpdate?: boolean;
  isAdmin?: boolean;
}
