export type ObjectPrivilegeTableFieldProps = {
  value?: ObjectPrivilegeValues[];
  onChange?: (value: ObjectPrivilegeValues[]) => void;
  selectedDBServiceID?: string;
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
  'getOperationPrivilegesPending' | 'objectPrivilegeOptions'
>;

export type ObjectPrivilegesFormFields = {
  data_objects?: IDataObjects[];
  data_operations?: string[];
};
