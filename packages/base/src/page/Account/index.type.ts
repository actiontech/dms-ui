import { IGetUser } from '@actiontech/shared/lib/api/base/service/common';
import { MessageInstance } from 'antd/es/message/interface';

export type PasswordFormFields = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export type UpdateComponentCommonProps = {
  userBaseInfo?: IGetUser;
  messageApi: MessageInstance;
  updateUserInfo: () => void;
};

export type GenerateTokenModalProps = {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
};

export type GenerateTokenFields = {
  expirationDays: number;
};

export type AccessTokenProps = {
  token?: string;
  expiration?: string;
  hasExpired?: boolean;
  updateUserInfo: () => void;
};

export type DefaultLoginPageProps = {
  userBaseInfo?: IGetUser;
  updateUserInfo: () => void;
};
