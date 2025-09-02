import { MessageInstance } from 'antd/es/message/interface';
import { IGetUser } from '@actiontech/shared/lib/api/base/service/common';

export type PasswordFormFields = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export type PrivacyAuthorizationProps = {
  isAuthorized: boolean;
};

export type UpdateComponentCommonProps = {
  userBaseInfo?: IGetUser;
  messageApi: MessageInstance;
  updateUserInfo: () => void;
  privacyAuthorization?: PrivacyAuthorizationProps;
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
