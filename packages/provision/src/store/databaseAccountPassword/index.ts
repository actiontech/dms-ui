import { atom } from 'recoil';
import { StoreKey } from '..';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { IPasswordSecurityPolicy } from '@actiontech/shared/lib/api/provision/service/common';
import { ModalName } from '~/data/enum';

export const PasswordSecurityPolicyModalStatus = atom<ModalStatus>({
  key: StoreKey.Password_Security_policy_Modal_Status,
  default: {
    [ModalName.CreatePasswordSecurityPolicyModal]: false,
    [ModalName.UpdatePasswordSecurityPolicyModal]: false
  }
});

export const PasswordSecurityPolicySelectData =
  atom<IPasswordSecurityPolicy | null>({
    key: StoreKey.Password_Security_policy_Select_Data,
    default: null
  });
