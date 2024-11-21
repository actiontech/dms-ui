import { atom } from 'recoil';
import { StoreKey } from '..';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { ModalName } from '~/data/enum';
import { IListDBRole } from '@actiontech/shared/lib/api/provision/service/common';

export const DatabaseRoleModalStatus = atom<ModalStatus>({
  key: StoreKey.Database_Role_Modal_Status,
  default: {
    [ModalName.DatabaseRoleCreateModal]: false,
    [ModalName.DatabaseRoleUpdateModal]: false,
    [ModalName.DatabaseRoleDetailModal]: false
  }
});

export const DatabaseRoleSelectData = atom<IListDBRole | null>({
  key: StoreKey.Database_Role_Select_Data,
  default: null
});

export const DatabaseRoleFilteredDBServiceID = atom<string | null>({
  key: StoreKey.Database_Role_Filtered_DB_SERVICE_ID,
  default: null
});
