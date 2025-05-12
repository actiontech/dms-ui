import { IDBAccountBody } from '@actiontech/shared/lib/api/provision/service/common';
import { SelectProps } from 'antd';
import { IAuthAddDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { IGetDBAccountReply } from '@actiontech/shared/lib/api/provision/service/common.d';
import { BackendFormValues } from '../../../../sqle/src/components/BackendForm';
import { IDatabasePrivilegesSelectorBaseFields } from '../../components/DatabasePrivilegesSelector/index.type';
import {
  AddDBAccountPasswordExpirationPolicyEnum,
  BatchUpdateDBAccountPasswordPasswordExpirationPolicyEnum,
  PasswordConfigPasswordExpirationPolicyEnum
} from '@actiontech/shared/lib/api/provision/service/common.enum';
import { ICustomDBPasswordRule } from '@actiontech/shared/lib/api/provision/service/common.d';

export type ExpendedDBAccountBody = IDBAccountBody & { id?: string };

export type AccountDiscoveryFormType = {
  environment: string;
  service: string;
  account: ExpendedDBAccountBody[];
};

export type AccountTableFieldProps = {
  value?: ExpendedDBAccountBody[];
  onChange?: (value?: ExpendedDBAccountBody[]) => void;
  data?: ExpendedDBAccountBody[];
  loading?: boolean;
  refresh: () => void;
};

export interface AccountPassword {
  password: string;
  confirm_password: string;
}

export type CreateAccountFormType = {
  username: string;
  effective_time_day: number;
  policy: string;
  explanation: string;
  environment: string;
  additionalParams: BackendFormValues;
  password_expiration_policy: AddDBAccountPasswordExpirationPolicyEnum;
} & IDatabasePrivilegesSelectorBaseFields &
  AccountPassword;

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
  effective_time_day: number;
  password_expiration_policy: PasswordConfigPasswordExpirationPolicyEnum;
} & AccountPassword;

export type ModifyPasswordItemType = {
  id: string;
  name: string;
} & AccountPassword;

export type BatchModifyPasswordFormType = {
  policy: string;
  effective_time_day: number;
  passwords: ModifyPasswordItemType[];
  password_expiration_policy: BatchUpdateDBAccountPasswordPasswordExpirationPolicyEnum;
};

export type PasswordRule = {
  key: keyof ICustomDBPasswordRule;
  label: string;
  validate: (value: string) => boolean;
};

export interface PasswordFieldProps {
  disabled?: boolean;
  showLabelTips?: boolean;
}
