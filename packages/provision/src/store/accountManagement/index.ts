import { atom } from 'recoil';
import { StoreKey } from '..';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';

export const AccountManagementModalStatus = atom<ModalStatus>({
  key: StoreKey.Account_Management_Modal_Status,
  default: {}
});

export const AccountManagementSelectData = atom<IListDBAccount | null>({
  key: StoreKey.Account_Management_Modal_Select_Data,
  default: null
});
