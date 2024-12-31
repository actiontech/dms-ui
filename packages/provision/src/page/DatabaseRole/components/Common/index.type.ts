import { FormInstance } from 'antd';
import { IDatabasePrivilegesSelectorBaseFields } from '../../../../components/DatabasePrivilegesSelector/index.type';

export interface IDatabaseRoleFormFields
  extends IDatabasePrivilegesSelectorBaseFields {
  roleName: string;
}

export interface IDatabaseRoleFormProps {
  form: FormInstance<IDatabaseRoleFormFields>;
  mode: 'create' | 'update';
  title: string;
}
