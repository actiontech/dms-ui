import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IPasswordSecurityPolicy } from '@actiontech/shared/lib/api/provision/service/common';
import { t } from '~/locale';

export const PasswordPolicyListColumns: ActiontechTableColumn<IPasswordSecurityPolicy> =
  [
    {
      dataIndex: 'name',
      title: t('password.policy.column.name')
    },
    {
      dataIndex: 'password_expiration_period',
      title: t('password.policy.column.expirationPeriod')
    }
  ];

export const PasswordPolicyListActions = (
  onEdit: (record?: IPasswordSecurityPolicy) => void,
  onDelete: (record?: IPasswordSecurityPolicy) => void
): ActiontechTableActionMeta<IPasswordSecurityPolicy>[] => [
  {
    text: t('common.edit'),
    key: 'editPolicy',
    buttonProps: (record) => {
      return {
        onClick: () => {
          onEdit(record);
        }
      };
    }
  },
  {
    text: t('common.delete'),
    buttonProps: () => ({
      danger: true
    }),
    key: 'deletePolicy',
    confirm: (record) => {
      return {
        title: t('password.policy.deleteTip', {
          name: record?.name ?? ''
        }),
        onConfirm: () => {
          onDelete(record);
        }
      };
    },
    permissions: (record) => !record?.is_default
  }
];
