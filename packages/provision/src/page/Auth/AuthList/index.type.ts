import { IGetAuthorizationReply } from '@actiontech/shared/lib/api/provision/service/common';
export interface IUpdateUserInAuthFormFields {
  permission_user_uid: string;
  db_account_password: string;
  confirm_db_account_password: string;
}

export interface IUpdateTemplateFormFields {
  data_permission_template_uid: string;
}

export interface IAuthDetailCustomConfig {
  key: keyof Required<IGetAuthorizationReply>['data'];
  type: 'p' | 'table';
  prefix: string;
  headers?: string[];
}

export interface IUpdateExpirationInAuthFormFields {
  renewal_effective_time_day: string;
}
