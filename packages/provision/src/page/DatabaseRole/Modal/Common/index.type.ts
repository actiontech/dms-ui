import { FormInstance } from 'antd';
import { IRolePermissionSelectorBaseFields } from '../../../../components/RolePermissionSelector/index.type';

export interface IDatabaseRoleFormFields
  extends IRolePermissionSelectorBaseFields {
  roleName: string;
  dbServiceID: string;
}

export interface IDatabaseRoleFormProps {
  form: FormInstance<IDatabaseRoleFormFields>;
  mode: 'create' | 'update';
}

export interface IPermissionSelectorProps {
  dbType: string;
}
