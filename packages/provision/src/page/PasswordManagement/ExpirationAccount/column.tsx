import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta,
  InlineActiontechTableMoreActionsButtonMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IAuthListDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import { t } from '~/locale';
import { Typography } from 'antd';
import { DBAccountStatusDictionary } from '../../AccountManagement/index.data';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ModalName } from '~/data/enum';
import { accountNameRender } from '../../AccountManagement/index.utils';

export type ExpirationAccountListFilterParamType = PageInfoWithoutIndexAndSize<
  IAuthListDBAccountParams & {
    page_index: number;
  },
  'project_uid'
>;

export const ExpirationAccountListColumns = (
  onUpdateFilter: (
    key: keyof ExpirationAccountListFilterParamType,
    value: string
  ) => void
): ActiontechTableColumn<
  IListDBAccount,
  ExpirationAccountListFilterParamType
> => {
  return [
    {
      dataIndex: 'account_info',
      title: t('databaseAccount.list.column.account'),
      render: (value: IListDBAccount['account_info']) => {
        return accountNameRender(value);
      }
    },
    {
      dataIndex: 'db_service',
      title: t('databaseAccount.list.column.dbService'),
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
      title: t('databaseAccount.list.column.expiredTime'),
      render: (val) => (val ? formatTime(val) : '-')
    },
    {
      dataIndex: 'remaining_days',
      title: t('databaseAccount.list.column.remainingDay'),
      render: (val) => val ?? '-'
    },
    {
      dataIndex: 'password_security_policy',
      title: t('databaseAccount.list.column.policy'),
      render: (value: IListDBAccount['password_security_policy']) => {
        return value || '-';
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_policy'
    },
    {
      dataIndex: 'status',
      title: t('databaseAccount.list.column.status'),
      render: (value: IListDBAccount['status']) => {
        return value ? DBAccountStatusDictionary[value] : '-';
      }
    }
  ];
};

export const ExpirationAccountListActions = (
  onOpenModal: (name: ModalName, record?: IListDBAccount) => void
): {
  moreButtons?: InlineActiontechTableMoreActionsButtonMeta<IListDBAccount>[];
  buttons: ActiontechTableActionMeta<IListDBAccount>[];
} => ({
  buttons: [
    {
      key: 'modifyPassword',
      text: t('databaseAccount.list.action.modifyPassword'),
      buttonProps: (record) => ({
        onClick: () =>
          onOpenModal(ModalName.DatabaseAccountModifyPasswordModal, record)
      })
    },
    {
      key: 'renewalPassword',
      text: t('databaseAccount.list.action.renewal'),
      buttonProps: (record) => ({
        onClick: () =>
          onOpenModal(ModalName.DatabaseAccountRenewalPasswordModal, record)
      })
    }
  ]
});
