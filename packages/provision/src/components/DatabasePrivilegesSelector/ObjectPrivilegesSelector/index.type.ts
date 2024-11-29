import { AuthListOperationsDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';

export type ObjectPrivilegeTableFieldProps = {
  value?: ObjectPrivilegeValues[];
  onChange?: (value: ObjectPrivilegeValues[]) => void;
  selectedDBServiceID?: string;
  selectedDBType: AuthListOperationsDbTypeEnum;
  objectPrivilegeOptions: Array<{ label: string; value: string }>;
  getOperationPrivilegesPending: boolean;
};

export type ObjectPrivilegeValues = {
  id?: string;
  objectsLabel: string[];
  operationsLabel: string[];
  objectsParams: string[];
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
