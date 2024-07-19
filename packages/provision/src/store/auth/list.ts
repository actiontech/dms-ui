import { atom } from 'recoil';
import { StoreKey } from '..';
import { IListAuthorization } from '@actiontech/shared/lib/api/provision/service/common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

export const AuthListModalStatus = atom<ModalStatus>({
  key: StoreKey.Auth_List_Modal_Status,
  default: {}
});

export const AuthListSelectData = atom<IListAuthorization | null>({
  key: StoreKey.Auth_List_Selected_Data,
  default: null
});
