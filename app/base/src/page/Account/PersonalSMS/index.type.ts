import { IGetUser } from '@actiontech/shared/lib/api/base/service/common';

export type FormFields = {
  enabled: boolean;
  code: string;
};

export type PersonalSMSProps = {
  userBaseInfo?: IGetUser;
  getUserInfo: () => void;
  loading: boolean;
};

export type ConfigFieldProps = {
  userPhone?: string;
  username?: string;
};
