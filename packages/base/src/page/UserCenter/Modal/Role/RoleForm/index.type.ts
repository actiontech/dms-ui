import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import { FormInstance } from 'antd5';

export interface IRoleFormFields {
  name: string;
  desc?: string;
  opPermissions?: string[];
  isDisabled?: boolean;
}

export interface IRoleFormProps {
  form: FormInstance<IRoleFormFields>;
  operationList: IListOpPermission[];
  getOpPermissionListLoading: boolean;
  isUpdate?: boolean;
}
