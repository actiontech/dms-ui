import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';
import { FormInstance } from 'antd';

export type UserGroupFormProps = {
  form?: FormInstance<UserGroupFormField>;
  userList?: IUidWithName[];
  getUserListLoading: boolean;
  isUpdate?: boolean;
};
export type UserGroupFormField = {
  name: string;
  desc?: string;
  userList?: string[];
  isDisabled?: boolean;
};
