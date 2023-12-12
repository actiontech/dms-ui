import { atom } from 'recoil';
import { StoreKey } from '..';
import { IListService } from '@actiontech/shared/lib/api/provision/service/common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

export const DataObjectModalStatus = atom<ModalStatus>({
  key: StoreKey.Data_Object_Modal_Status,
  default: {}
});

export const DataObjectSelectedData = atom<IListService | null>({
  key: StoreKey.Data_Object_Selected_Data,
  default: null
});
