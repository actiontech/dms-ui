import { AddDBAccountPasswordExpirationPolicyEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import { t } from '../../../../locale';

export const passwordExpirationPolicyOptions: Array<{
  label: string;
  value: AddDBAccountPasswordExpirationPolicyEnum;
}> = [
  {
    label: t('databaseAccount.create.form.passwordExpirationPolicyLabel1'),
    value: AddDBAccountPasswordExpirationPolicyEnum.expiration_available
  },
  {
    label: t('databaseAccount.create.form.passwordExpirationPolicyLabel2'),
    value: AddDBAccountPasswordExpirationPolicyEnum.expiration_lock
  }
];
