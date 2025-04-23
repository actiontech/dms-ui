import { ListDBAccountStatusEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import { t } from '../../locale';

export const DBAccountStatusDictionary: Record<
  ListDBAccountStatusEnum,
  string
> = {
  [ListDBAccountStatusEnum.lock]: t('databaseAccount.list.lock'),
  [ListDBAccountStatusEnum.unlock]: t('databaseAccount.list.unlock'),
  [ListDBAccountStatusEnum.expired]: t('databaseAccount.list.expired')
};

export const DBAccountStatusOptions = [
  {
    label: DBAccountStatusDictionary[ListDBAccountStatusEnum.lock],
    value: ListDBAccountStatusEnum.lock
  },
  {
    label: DBAccountStatusDictionary[ListDBAccountStatusEnum.unlock],
    value: ListDBAccountStatusEnum.unlock
  },
  {
    label: DBAccountStatusDictionary[ListDBAccountStatusEnum.expired],
    value: ListDBAccountStatusEnum.expired
  }
];

export const DBAccountPasswordManagedOptions = [
  {
    label: t('databaseAccount.list.managed'),
    value: 'true'
  },
  {
    label: t('databaseAccount.list.unmanaged'),
    value: 'false'
  }
];
