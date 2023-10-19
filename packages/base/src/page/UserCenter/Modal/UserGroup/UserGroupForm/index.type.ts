import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';
import { FormInstance } from 'antd5';

export type UserGroupFormProps = {
  form?: FormInstance<UserGroupFormField>;
  userList?: IUidWithName[];
  isUpdate?: boolean;
};
export type UserGroupFormField = {
  name: string;
  desc?: string;
  userList?: string[];
  isDisabled?: boolean;
};
