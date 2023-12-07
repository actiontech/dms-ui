import { IAddAuthorization } from '@actiontech/shared/lib/api/provision/service/common';

export interface AddAuthFormFields {
  data_permission_template_uid: string;
  hostname: string;
  password: string;
  confirm_password: string;
  username: string;
  effective_time_day: number;
  memo: string;
  permission_user_uid: string;
  purpose: string;
}

export interface UserSelectProps {
  className?: string;
}

export interface PreviewModalProps {
  params?: IAddAuthorization;
  onSuccess: () => void;
  setParams: (params?: IAddAuthorization) => void;
}
