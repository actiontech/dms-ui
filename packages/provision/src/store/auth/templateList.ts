import { atom } from 'recoil';
import { ModalStatus } from '~/types/common.type';
import { StoreKey } from '..';
import { IListDataPermissionTemplate } from '@actiontech/shared/lib/api/provision/service/common';

export const AuthDataPermissionListModalStatus = atom<ModalStatus>({
  key: StoreKey.Auth_Data_Permission_List_Modal_Status,
  default: {}
});

export const AuthTemplateModalStatus = atom<ModalStatus>({
  key: StoreKey.Auth_Template_Modal_Status,
  default: {}
});

export const AuthTemplateListSelectData =
  atom<IListDataPermissionTemplate | null>({
    key: StoreKey.Auth_Template_List_Selected_Data,
    default: null
  });
