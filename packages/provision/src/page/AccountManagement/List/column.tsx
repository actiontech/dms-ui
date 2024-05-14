import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta,
  InlineActiontechTableMoreActionsButtonMeta,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IAuthListDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import { t } from '~/locale';
import { AvatarCom } from '@actiontech/shared';
import { Space, Typography } from 'antd';
import { DBAccountStatusDictionary } from '../index.data';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ModalName } from '~/data/enum';

export type AccountListFilterParamType = PageInfoWithoutIndexAndSize<
  IAuthListDBAccountParams & {
    page_index: number;
  },
  'project_uid'
>;

export const ExtraFilterMeta: () => ActiontechTableFilterMeta<
  IListDBAccount,
  AccountListFilterParamType
> = () => {
  return new Map<
    keyof IListDBAccount,
    ActiontechTableFilterMetaValue<AccountListFilterParamType>
  >([
    [
      'auth_users',
      {
        filterCustomType: 'select',
        filterKey: 'filter_by_user',
        filterLabel: t('account.list.member')
      }
    ]
  ]);
};

export const AccountListColumns = (
  onUpdateFilter: (key: keyof AccountListFilterParamType, value: string) => void
): ActiontechTableColumn<IListDBAccount, AccountListFilterParamType> => {
  return [
    {
      dataIndex: 'account_info',
      title: t('account.list.column.account'),
      render: (value: IListDBAccount['account_info']) => {
        if (!value?.hostname) {
          return value?.user ?? '-';
        }
        return `${value?.user}@${value.hostname}`;
      }
    },
    {
      dataIndex: 'db_service',
      title: t('account.list.column.dbService'),
      render: (value: IListDBAccount['db_service']) => {
        return (
          <Typography.Link
            onClick={() =>
              onUpdateFilter('filter_by_db_service', value?.uid ?? '')
            }
          >
            {value?.name || '-'}
          </Typography.Link>
        );
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_db_service'
    },
    {
      dataIndex: 'expired_time',
      title: t('account.list.column.expiredTime'),
      render: (val) => (val ? formatTime(val) : '-'),
      filterKey: ['filter_by_expired_time_from', 'filter_by_expired_time_to'],
      filterCustomType: 'date-range'
    },
    {
      dataIndex: 'password_security_policy',
      title: t('account.list.column.policy'),
      render: (value: IListDBAccount['password_security_policy']) => {
        return value || '-';
      }
    },
    {
      dataIndex: 'status',
      title: t('account.list.column.status'),
      filterKey: 'filter_by_status',
      filterCustomType: 'select',
      render: (value: IListDBAccount['status']) => {
        return value ? DBAccountStatusDictionary[value] : '-';
      }
    },
    {
      dataIndex: 'platform_managed',
      title: t('account.list.column.deposit'),
      render: (value: IListDBAccount['platform_managed']) => {
        return value ? t('account.list.managed') : t('account.list.unmanaged');
      },
      filterKey: 'filter_by_password_managed',
      filterCustomType: 'select'
    },
    {
      dataIndex: 'auth_users',
      className: 'ellipsis-column-width',
      title: t('account.list.column.auth'),
      render: (value: IListDBAccount['auth_users']) => {
        if (!value || !value.length) {
          return '-';
        }
        return (
          <Space>
            {value.map((i) => {
              return (
                <AvatarCom
                  onClick={() => onUpdateFilter('filter_by_user', i?.uid ?? '')}
                  key={i.uid}
                  size="small"
                  name={i.name ?? ''}
                />
              );
            })}
          </Space>
        );
      }
    },
    {
      dataIndex: 'explanation',
      title: t('account.list.column.desc'),
      render: (value: IListDBAccount['explanation']) => {
        return value || '-';
      }
    }
  ];
};

export const AccountListActions = (
  onOpenModal: (name: ModalName, record?: IListDBAccount) => void
): {
  moreButtons?: InlineActiontechTableMoreActionsButtonMeta<IListDBAccount>[];
  buttons: ActiontechTableActionMeta<IListDBAccount>[];
} => ({
  buttons: [
    {
      key: 'account_view',
      text: t('account.list.action.view'),
      buttonProps: (record) => ({
        onClick: () => onOpenModal(ModalName.AccountDetailModal, record)
      })
    }
  ],
  moreButtons: [
    {
      key: 'account_authorize',
      text: t('account.list.action.authorize'),
      onClick: (record) => onOpenModal(ModalName.AccountAuthorizeModal, record)
      // disabled: (record) => {
      //   return record?.expiration === -1;
      // }
    },
    {
      key: 'modifyPassword',
      text: t('account.list.action.modifyPassword'),
      onClick: (record) =>
        onOpenModal(ModalName.AccountModifyPasswordModal, record)
    },
    {
      key: 'account_renewal',
      text: t('account.list.action.renewal'),
      onClick: (record) =>
        onOpenModal(ModalName.AccountRenewalPasswordModal, record)
    },
    {
      key: 'modifyPermission',
      text: t('account.list.action.modifyPermission')
    },
    {
      key: 'account_disable',
      text: t('account.list.action.disable')
    },
    {
      key: 'account_delete',
      text: t('account.list.action.delete')
    },
    {
      key: 'account_manage',
      text: t('account.list.action.manage')
    }
  ]
});
