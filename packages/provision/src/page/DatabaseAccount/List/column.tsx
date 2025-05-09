import {
  ActiontechTableColumn,
  ActiontechTableActionMeta,
  InlineActiontechTableMoreActionsButtonMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import { t } from '../../../locale';
import { BasicToolTip } from '@actiontech/shared';
import { Space, Typography } from 'antd';
import { DBAccountStatusDictionary } from '../index.data';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ModalName } from '../../../data/enum';
import {
  ListDBAccountPasswordExpirationPolicyEnum,
  ListDBAccountStatusEnum
} from '@actiontech/shared/lib/api/provision/service/common.enum';
import { accountNameRender } from '../index.utils';
import { DatabaseAccountListFilterParamType } from './index.type';
import AuthDisplay, { AuthType } from '../components/AuthDisplay';

export const DatabaseAccountListColumns = (
  onUpdateFilter: (
    key: keyof DatabaseAccountListFilterParamType,
    value?: string
  ) => void
): ActiontechTableColumn<
  IListDBAccount,
  DatabaseAccountListFilterParamType
> => {
  return [
    {
      dataIndex: 'account_info',
      title: t('databaseAccount.list.column.account'),
      render: (value) => {
        return accountNameRender(value);
      }
    },
    {
      dataIndex: 'db_service',
      title: t('databaseAccount.list.column.dbService'),
      render: (value) => {
        return (
          <Typography.Link
            onClick={() => onUpdateFilter('filter_by_db_service', value?.uid!)}
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
      title: t('databaseAccount.list.column.expiredTime'),
      render: (val, record) => {
        if (!val) {
          return '-';
        }
        if (record.password_expired) {
          return `${formatTime(val)}（${t(
            'databaseAccount.list.column.expired'
          )}）`;
        }
        return formatTime(val);
      },
      filterKey: ['filter_by_expired_time_from', 'filter_by_expired_time_to'],
      filterCustomType: 'date-range'
    },
    {
      dataIndex: 'password_expiration_policy',
      title: t('databaseAccount.list.column.passwordExpirationPolicy'),
      render: (val) =>
        val === ListDBAccountPasswordExpirationPolicyEnum.expiration_lock
          ? t('databaseAccount.list.column.lock')
          : t('databaseAccount.list.column.available')
    },
    {
      dataIndex: 'status',
      title: () => (
        <BasicToolTip
          suffixIcon
          title={
            <span className="whitespace-pre-line">
              {t('databaseAccount.list.column.statusTips')}
            </span>
          }
        >
          {t('databaseAccount.list.column.status')}
        </BasicToolTip>
      ),
      filterKey: 'filter_by_status',
      filterCustomType: 'select',
      render: (value) => {
        return value ? DBAccountStatusDictionary[value] : '-';
      }
    },
    {
      dataIndex: 'platform_managed',
      title: () => (
        <BasicToolTip
          suffixIcon
          title={t('databaseAccount.list.column.depositTips')}
        >
          {t('databaseAccount.list.column.deposit')}
        </BasicToolTip>
      ),
      render: (value) => {
        return value
          ? t('databaseAccount.list.managed')
          : t('databaseAccount.list.unmanaged');
      },
      filterKey: 'filter_by_password_managed',
      filterCustomType: 'select'
    },
    {
      dataIndex: 'auth_users',
      className: 'ellipsis-column-width',
      title: t('databaseAccount.list.column.auth'),
      filterKey: 'filter_by_users',
      filterCustomType: 'select',
      render: (value, record) => {
        const { auth_users, auth_user_groups } = record;
        if (!value || (!auth_users?.length && !auth_user_groups?.length)) {
          return '-';
        }
        return (
          <Space size={0}>
            <AuthDisplay
              type={AuthType.USER}
              authUsers={auth_users || []}
              onUserClick={(uid) => onUpdateFilter('filter_by_users', uid)}
            />
            <AuthDisplay
              type={AuthType.GROUP}
              authUserGroups={auth_user_groups || []}
              onGroupClick={(uid) =>
                onUpdateFilter('filter_by_user_group', uid)
              }
            />
          </Space>
        );
      }
    },
    {
      dataIndex: 'auth_user_groups',
      show: false,
      title: t('databaseAccount.list.column.authUserGroup'),
      filterKey: 'filter_by_user_group',
      filterCustomType: 'select'
    },
    {
      dataIndex: 'explanation',
      title: t('databaseAccount.list.column.desc'),
      render: (value) => {
        return value || '-';
      }
    }
  ];
};

export const DatabaseAccountListActions = (
  onOpenModal: (name: ModalName, record?: IListDBAccount) => void,
  onSetLockedStatus: (lock: boolean, id?: string) => void,
  onSetManagedStatus: (managed: boolean, id?: string) => void,
  onDeleteAccount: (id?: string) => void,
  onUnsyncAccount: (id?: string) => void,
  onNavigateToUpdatePage: (id?: string) => void,
  isHaveServicePermission: (serviceID?: string) => boolean
): {
  moreButtons: (
    record: IListDBAccount
  ) => InlineActiontechTableMoreActionsButtonMeta<IListDBAccount>[];
  buttons: ActiontechTableActionMeta<IListDBAccount>[];
} => ({
  buttons: [
    {
      key: 'account_view',
      text: t('databaseAccount.list.action.view'),
      buttonProps: (record) => ({
        onClick: () => onOpenModal(ModalName.DatabaseAccountDetailModal, record)
      })
    },
    {
      key: 'account_authorize',
      text: t('databaseAccount.list.action.authorize'),
      buttonProps: (record) => {
        return {
          onClick: () =>
            onOpenModal(ModalName.DatabaseAccountAuthorizeModal, record)
        };
      },
      permissions: (record) =>
        !!record?.platform_managed &&
        isHaveServicePermission(record.db_service?.uid)
    }
  ],
  moreButtons: (columnRecord) => {
    return isHaveServicePermission(columnRecord.db_service?.uid)
      ? [
          {
            key: 'modifyPassword',
            text: t('databaseAccount.list.action.modifyPassword'),
            onClick: (record) =>
              onOpenModal(ModalName.DatabaseAccountModifyPasswordModal, record)
          },
          {
            key: 'account_renewal',
            text: t('databaseAccount.list.action.renewal'),
            onClick: (record) =>
              onOpenModal(
                ModalName.DatabaseAccountRenewalPasswordModal,
                record
              ),
            permissions: (record) => !!record?.expired_time
          },
          {
            key: 'modify_permission',
            text: t('databaseAccount.list.action.modifyPrivilege'),
            onClick: (record) => onNavigateToUpdatePage(record?.db_account_uid)
          },
          {
            key: 'account_disable',
            text: t('databaseAccount.list.action.disable'),
            onClick: (record) =>
              onSetLockedStatus(true, record?.db_account_uid),
            permissions: (record) =>
              record?.status === ListDBAccountStatusEnum.unlock
          },
          {
            key: 'account_enable',
            text: t('databaseAccount.list.action.enable'),
            onClick: (record) =>
              onSetLockedStatus(false, record?.db_account_uid),
            permissions: (record) =>
              record?.status === ListDBAccountStatusEnum.lock
          },
          {
            key: 'account_delete',
            text: t('databaseAccount.list.action.delete'),
            confirm: (record) => ({
              title: t('databaseAccount.list.deleteConfirm', {
                name: accountNameRender(record?.account_info)
              }),
              okText: t('common.ok'),
              cancelText: t('common.cancel'),
              onConfirm: () => {
                onDeleteAccount(record?.db_account_uid);
              }
            })
          },
          {
            key: 'account_unsync',
            text: t('databaseAccount.list.action.unsync'),
            confirm: (record) => ({
              title: t('databaseAccount.list.unsyncConfirm', {
                name: accountNameRender(record?.account_info)
              }),
              okText: t('common.ok'),
              cancelText: t('common.cancel'),
              onConfirm: () => {
                onUnsyncAccount(record?.db_account_uid);
              }
            })
          },
          {
            key: 'account_manage',
            text: t('databaseAccount.list.action.manage'),
            onClick: (record) =>
              onOpenModal(ModalName.DatabaseAccountManagePasswordModal, record),
            permissions: (record) => !record?.platform_managed
          },
          {
            key: 'account_cancelManage',
            text: t('databaseAccount.list.action.cancelManage'),
            confirm: (record) => ({
              title: t('databaseAccount.list.cancelManage'),
              okText: t('common.ok'),
              cancelText: t('common.cancel'),
              onConfirm: () => {
                onSetManagedStatus(false, record?.db_account_uid);
              }
            }),
            permissions: (record) => !!record?.platform_managed
          }
        ]
      : [];
  }
});
