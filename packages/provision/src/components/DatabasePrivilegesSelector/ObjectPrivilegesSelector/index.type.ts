import { AuthListOperationsDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { IDatabasePrivilegeOption } from '../useDatabasePrivilegesTips';

export type ObjectPrivilegeTableFieldProps = {
  value?: ObjectPrivilegeValues[];
  onChange?: (value: ObjectPrivilegeValues[]) => void;
  selectedDBServiceID?: string;
  selectedDBType: AuthListOperationsDbTypeEnum;
  objectPrivilegeOptions: Array<IDatabasePrivilegeOption>;
  getOperationPrivilegesPending: boolean;
};

export type ObjectPrivilegeValues = {
  id?: string;
  objectsLabel: string[];
  operationsLabel: string[];
  objectsValue?: IDataObjects[];
  operationsValue: string[];
};

export interface IDataObjects {
  database: string;
  tables?: string[];
}

export type ObjectPrivilegesModalProps = {
  visible: boolean;
  onSubmit?: (data: ObjectPrivilegeValues[]) => void;
  onCancel?: () => void;
  editId?: string;
  service?: string;
  data: ObjectPrivilegeValues[];
} & Pick<
  ObjectPrivilegeTableFieldProps,
  'getOperationPrivilegesPending' | 'objectPrivilegeOptions' | 'selectedDBType'
>;

export type ObjectPrivilegesFormFields = {
  data_objects?: IDataObjects[];
  data_operations?: string[];
};
