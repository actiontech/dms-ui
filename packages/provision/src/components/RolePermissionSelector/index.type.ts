import { FormInstance } from 'antd';

export interface IRolePermissionSelectorBaseFields {
  dbServiceID: string;
  dbType: string;
  authType: 'role' | 'permission';
  dbRoles?: string[];
  operationsPermissions?: string[][];
}

export interface IRolePermissionSelectorProps<
  T extends IRolePermissionSelectorBaseFields
> {
  form: FormInstance<T>;
  projectID: string;
  showQuickCreateRole?: boolean;
  mode: 'create' | 'update';
}
