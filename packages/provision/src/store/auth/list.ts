import { atom } from 'recoil';
import { StoreKey } from '..';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

export const AuthListModalStatus = atom<ModalStatus>({
  key: StoreKey.Auth_List_Modal_Status,
  default: {}
});
