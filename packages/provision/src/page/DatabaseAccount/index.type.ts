import { IDBAccountBody } from '@actiontech/shared/lib/api/provision/service/common';
import { SelectProps } from 'antd';
import { IAuthAddDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { IGetDBAccountReply } from '@actiontech/shared/lib/api/provision/service/common.d';
import { BackendFormValues } from '../../../../sqle/src/components/BackendForm';
import { IRolePermissionSelectorBaseFields } from '../../components/RolePermissionSelector/index.type';

export type AccountDiscoveryFormType = {
  business: string;
  service: string;
  account: IDBAccountBody[];
};

export type AccountTableFieldProps = {
  value?: IDBAccountBody[];
  onChange?: (value?: IDBAccountBody[]) => void;
  data?: IDBAccountBody[];
  loading?: boolean;
  refresh: () => void;
};

export type CreateAccountFormType = {
  hostname: string;
  password: string;
  confirm_password: string;
  username: string;
  effective_time_day: number;
  policy: string;
  explanation: string;
  business: string;
  additionalParams: BackendFormValues;
} & IRolePermissionSelectorBaseFields;

export type PermissionsType = {
  id?: string;
  objectsLabel: string[];
  operationsLabel: string[];
  objectsParams: string[];
  objectsValue?: IDataObjects[];
  operationsValue: string[];
};

export type PermissionTableFieldProps = {
  value?: PermissionsType[];
  onChange?: (value: PermissionsType[]) => void;
};

export interface IDataObjects {
  database?: string;
  tables?: string[];
}

export type PermissionModalProps = {
  visible: boolean;
  onSubmit?: (data: PermissionsType[]) => void;
  loading?: boolean;
  onCancel?: () => void;
  editId?: string;
  service?: string;
  data: PermissionsType[];
};

export type PermissionModalFormType = {
  data_objects?: IDataObjects[];
  data_operations?: string[];
};

export type ServiceFieldProps = {
  value?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  options?: SelectProps['options'];
  onSyncService?: () => void;
  syncServiceLoading?: boolean;
  disabled?: boolean;
};

export type PreviewModalProps = {
  params?: IAuthAddDBAccountParams;
  onSuccess: () => void;
  setParams: (params?: IAuthAddDBAccountParams) => void;
};

export interface IAccountDetailCustomConfig {
  key: keyof Required<IGetDBAccountReply>['data'];
  type: 'p' | 'table';
  prefix: string;
  headers?: string[];
}

export type ModifyPasswordFormType = {
  policy: string;
  password: string;
  confirm_password: string;
  effective_time_day: number;
};

export type ModifyPasswordItemType = {
  id: string;
  name: string;
  password: string;
  confirm_password: string;
};

export type BatchModifyPasswordFormType = {
  policy: string;
  effective_time_day: number;
  passwords: ModifyPasswordItemType[];
};
