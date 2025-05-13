import { t } from '../../../locale';
import { CharTypeOption } from './type';

export const charTypeOptions: CharTypeOption[] = [
  {
    label: t('dmsSystem.databaseAccountPasswordPolicy.requireUppercase'),
    value: 'require_uppercase'
  },
  {
    label: t('dmsSystem.databaseAccountPasswordPolicy.requireLowercase'),
    value: 'require_lowercase'
  },
  {
    label: t('dmsSystem.databaseAccountPasswordPolicy.requireDigit'),
    value: 'require_digit'
  },
  {
    label: t('dmsSystem.databaseAccountPasswordPolicy.requireSpecial'),
    value: 'require_special'
  }
];
