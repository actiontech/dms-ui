export interface IAddDataPermission {
  dataPermissions: IDataPermissionsTable[];
  setDataPermissions: (permissions: IDataPermissionsTable[]) => void;
  editIndex?: number;
  setEditIndex: (index?: number) => void;
}

export interface IFormFields {
  business?: string;
  service?: string;
  data_objects?: IDataObjects[];
  data_operations?: string[];
}

export interface IDataPermissionsTable {
  index: number;
  business: string;
  serviceValue: string;
  objectsValue?: IDataObjects[];
  operationsValue: string[];

  serviceLabel: string;
  objectsLabel: string[];
  operationsLabel: string[];

  objectsParams: string[];
}

export interface IDataObjects {
  database?: string;
  tables?: string[];
}
