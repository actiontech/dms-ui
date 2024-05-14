import { IAccountDetailCustomConfig } from '../../index.type';
import { t } from '~/locale';

export const accountDetailCustomConfig: IAccountDetailCustomConfig[] = [
  {
    key: 'auth_users',
    type: 'p',
    prefix: t('account.detail.authUser')
  },
  {
    key: 'data_permissions',
    type: 'table',
    prefix: t('account.create.permissionInfo'),
    headers: [
      t('account.discovery.service'),
      t('account.create.form.objects'),
      t('account.create.form.operation')
    ]
  },
  {
    key: 'account_info',
    type: 'table',
    prefix: t('account.detail.accountInfo'),
    headers: [
      t('account.detail.address'),
      t('account.create.form.username'),
      t('account.create.form.hostname'),
      t('account.create.form.password'),
      t('account.create.form.desc')
    ]
  }
];
