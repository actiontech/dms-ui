import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta,
  InlineActiontechTableMoreActionsButtonMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IAuthListDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import { t } from '../../../locale';
import { CustomAvatar, BasicToolTip } from '@actiontech/shared';
import { Space, Typography } from 'antd';
import { DBAccountStatusDictionary } from '../index.data';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ModalName } from '../../../data/enum';
import { ListDBAccountStatusEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import { accountNameRender } from '../index.utils';

export type DatabaseAccountListFilterParamType = PageInfoWithoutIndexAndSize<
  IAuthListDBAccountParams & {
    page_index: number;
  },
  'project_uid'
>;

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
            onClick={() => onUpdateFilter('filter_by_db_service', value?.uid)}
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
      render: (val) => (val ? formatTime(val) : '-'),
      filterKey: ['filter_by_expired_time_from', 'filter_by_expired_time_to'],
      filterCustomType: 'date-range'
    },
    {
      dataIndex: 'password_security_policy',
      title: t('databaseAccount.list.column.policy'),
      render: (value) => {
        return value || '-';
      }
    },
    {
      dataIndex: 'status',
      title: () => (
        <BasicToolTip
          suffixIcon
          title={t('databaseAccount.list.column.statusTips')}
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
      filterKey: 'filter_by_user',
      filterCustomType: 'select',
      render: (value) => {
        if (!value || !value.length) {
          return '-';
        }
        return (
          <Space>
            {value.map((i) => {
              return (
                <CustomAvatar
                  onClick={() => onUpdateFilter('filter_by_user', i?.uid)}
                  key={i.uid}
                  size="small"
                  name={i.name}
                />
              );
            })}
          </Space>
        );
      }
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
