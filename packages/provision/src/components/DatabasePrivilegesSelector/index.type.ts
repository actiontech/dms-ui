import { FormInstance } from 'antd';
import { ObjectPrivilegeValues } from './ObjectPrivilegesSelector/index.type';

export interface IDatabasePrivilegesSelectorBaseFields {
  dbServiceID: string;
  dbType: string;
  dbRoles?: string[];
  objectPrivileges?: ObjectPrivilegeValues[];
  systemPrivileges?: string[];
}

export interface IDatabasePrivilegesSelectorProps<
  T extends IDatabasePrivilegesSelectorBaseFields
> {
  form: FormInstance<T>;
  projectID: string;
  showQuickCreateRole?: boolean;
  mode: 'create' | 'update';
}
