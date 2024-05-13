import { atom } from 'recoil';
import { StoreKey } from '..';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

export const AccountManagementModalStatus = atom<ModalStatus>({
  key: StoreKey.Account_Management_Modal_Status,
  default: {}
});
