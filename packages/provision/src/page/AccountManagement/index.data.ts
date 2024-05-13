import { ListDBAccountStatusEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import { t } from '~/locale';

export const DBAccountStatusDictionary = {
  [ListDBAccountStatusEnum.lock]: t('account.list.lock'),
  [ListDBAccountStatusEnum.unlock]: t('account.list.unlock')
};

export const DBAccountStatusOptions = [
  {
    label: DBAccountStatusDictionary[ListDBAccountStatusEnum.lock],
    value: ListDBAccountStatusEnum.lock
  },
  {
    label: DBAccountStatusDictionary[ListDBAccountStatusEnum.unlock],
    value: ListDBAccountStatusEnum.unlock
  }
];

export const DBAccountPasswordManagedOptions = [
  {
    label: t('account.list.managed'),
    value: 'true'
  },
  {
    label: t('account.list.unmanaged'),
    value: 'false'
  }
];
