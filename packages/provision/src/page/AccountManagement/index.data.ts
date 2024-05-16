import { ListDBAccountStatusEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import { t } from '../../locale';

export const DBAccountStatusDictionary = {
  [ListDBAccountStatusEnum.lock]: t('databaseAccount.list.lock'),
  [ListDBAccountStatusEnum.unlock]: t('databaseAccount.list.unlock')
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
    label: t('databaseAccount.list.managed'),
    value: 'true'
  },
  {
    label: t('databaseAccount.list.unmanaged'),
    value: 'false'
  }
];

export const DBAccountPasswordUsedByWorkbenchOptions = [
  {
    label: t('common.true'),
    value: 'true'
  },
  {
    label: t('common.false'),
    value: 'false'
  }
];
