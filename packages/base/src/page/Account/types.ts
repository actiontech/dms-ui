import { t } from '../../locale';
import { IUpdateUser } from '@actiontech/shared/lib/api/base/service/common';
export type PasswordFormFields = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export type BaseUpdateDataType = Pick<IUpdateUser, 'email' | 'phone' | 'wxid'>;

export const CurrentUpdateDataTypeLabel: Record<
  keyof BaseUpdateDataType,
  string
> = {
  email: t('dmsUserCenter.user.userForm.email'),
  phone: t('dmsAccount.phone'),
  wxid: t('dmsAccount.wechat')
};
