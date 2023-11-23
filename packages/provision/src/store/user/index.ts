import { atom } from 'recoil';
import { StoreKey } from '..';
import { IListUser } from '@actiontech/shared/lib/api/provision/service/common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

export const UserModalStatus = atom<ModalStatus>({
  key: StoreKey.User_Modal_Status,
  default: {}
});

export const UserSelectedData = atom<IListUser | null>({
  key: StoreKey.User_Selected_Data,
  default: null
});
