import { atom } from 'recoil';
import { StoreKey } from '..';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';

export const DatabaseAccountModalStatus = atom<ModalStatus>({
  key: StoreKey.Database_Account_Management_Modal_Status,
  default: {}
});

export const DatabaseAccountSelectData = atom<IListDBAccount | null>({
  key: StoreKey.Database_Account_Management_Modal_Select_Data,
  default: null
});

export const DatabaseAccountBatchActionSelectedData = atom<IListDBAccount[]>({
  key: StoreKey.Database_Account_Management_Modal_Batch_Action_Select_Data,
  default: []
});
