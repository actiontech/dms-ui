import { IAccountDetailCustomConfig } from '../../index.type';
import { t } from '../../../../locale';

export const accountDetailCustomConfig: IAccountDetailCustomConfig[] = [
  {
    key: 'auth_users',
    type: 'p',
    prefix: t('databaseAccount.detail.authUser')
  },
  {
    key: 'data_permissions',
    type: 'table',
    prefix: t('databaseAccount.create.permissionInfo'),
    headers: [
      t('databaseAccount.discovery.service'),
      t('databaseAccount.create.form.objects'),
      t('databaseAccount.create.form.operation')
    ]
  },
  {
    key: 'account_info',
    type: 'table',
    prefix: t('databaseAccount.detail.accountInfo'),
    headers: [
      t('databaseAccount.detail.address'),
      t('databaseAccount.create.form.username'),
      t('databaseAccount.create.form.hostname'),
      t('databaseAccount.create.form.password'),
      t('databaseAccount.create.form.desc')
    ]
  }
];
