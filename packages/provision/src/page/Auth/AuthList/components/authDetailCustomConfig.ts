import { IAuthDetailCustomConfig } from '../index.type';
import { t } from '~/locale';

export const authDetailCustomConfig: IAuthDetailCustomConfig[] = [
  {
    key: 'purpose',
    type: 'p',
    prefix: t('auth.addAuth.steps.purpose')
  },
  {
    key: 'businesses',
    type: 'p',
    prefix: t('auth.connectionDetails.business')
  },
  {
    key: 'permission_user',
    type: 'p',
    prefix: t('auth.columns.permissionUser')
  },
  {
    key: 'data_permissions',
    type: 'table',
    prefix: t('auth.template.columns.template_details'),
    headers: [
      t('auth.addAuth.baseForm.baseFormTable.service'),
      t('auth.addAuth.baseForm.baseFormTable.objects'),
      t('auth.addAuth.baseForm.baseFormTable.operation')
    ]
  },
  {
    key: 'db_accounts',
    type: 'table',
    prefix: t('auth.connectionDetails.accountInfo'),
    headers: [
      t('auth.connectionDetails.dns'),
      t('auth.addAuth.accountForm.username'),
      t('auth.addAuth.accountForm.hostname'),
      t('auth.addAuth.accountForm.password'),
      t('auth.connectionDetails.explanation')
    ]
  }
];
