import { ListDBAccountStatusEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import { t } from '../../locale';
import Password from '../../utils/Password';
import { PasswordRule } from './index.type';

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

export const defaultRules: PasswordRule[] = [
  {
    key: 'require_uppercase',
    label: t('databaseAccount.passwordRule.requireUppercase'),
    validate: (v) => Password.hasCapitalLetter(v)
  },
  {
    key: 'require_lowercase',
    label: t('databaseAccount.passwordRule.requireLowercase'),
    validate: (v) => Password.hasLowercaseLetter(v)
  },
  {
    key: 'require_digit',
    label: t('databaseAccount.passwordRule.requireDigit'),
    validate: (v) => Password.hasNumber(v)
  },
  {
    key: 'require_special',
    label: t('databaseAccount.passwordRule.requireSpecial'),
    validate: (v) => Password.hasSpecialChar(v)
  }
];
