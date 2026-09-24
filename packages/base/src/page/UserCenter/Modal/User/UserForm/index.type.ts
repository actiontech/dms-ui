import { FormInstance } from 'antd';

export interface IUserFormFields {
  username: string;
  password: string;
  passwordConfirm: string;
  needUpdatePassWord?: boolean;
  email?: string;
  phone?: string;
  wxid?: string;
  opPermissionUids?: string[];
  isDisabled: boolean;
}

export interface IUserFormProps {
  form: FormInstance<IUserFormFields>;
  visible: boolean;
  isUpdate?: boolean;
  /** 目标用户是否为 admin（控制禁用开关展示；勿与「当前操作者是否内置」混淆） */
  isAdmin?: boolean;
  /** 当前操作者是否可授予/收回「系统管理员」；false 时锁定 700017 选项 */
  canEditGlobalManagement?: boolean;
}
