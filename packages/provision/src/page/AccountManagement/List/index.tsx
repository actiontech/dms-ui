import { useTranslation } from 'react-i18next';
import { PageHeader, BasicButton } from '@actiontech/shared';
import { Space } from 'antd';
import {
  ActiontechTable,
  useTableFilterContainer,
  useTableRequestError,
  TableFilterContainer,
  TableToolbar,
  FilterCustomProps,
  ColumnsSettingProps,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { IAuthListDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import { useMemo, useEffect, useState, useCallback } from 'react';
import {
  AccountListColumns,
  AccountListFilterParamType,
  ExtraFilterMeta,
  AccountListActions
} from './column';
import {
  DBAccountStatusOptions,
  DBAccountPasswordManagedOptions
} from '../index.data';
import useProvisionUser from '~/hooks/useProvisionUser';
import useServiceOptions from '~/hooks/useServiceOptions';
import useModalStatus from '~/hooks/useModalStatus';
import { AccountManagementModalStatus } from '~/store/accountManagement';
import { EventEmitterKey, ModalName } from '~/data/enum';
import AccountDiscoveryModal from '../Modal/AccountDiscovery';
import EventEmitter from '~/utils/EventEmitter';
import { Link } from 'react-router-dom';

const AccountList = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const { username } = useCurrentUser();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { updateUserList, userIDOptions } = useProvisionUser();

  const { updateServiceList, serviceOptions } = useServiceOptions();

  const { toggleModal, initModalStatus } = useModalStatus(
    AccountManagementModalStatus
  );

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    setSearchKeyword,
    refreshBySearchKeyword,
    searchKeyword
  } = useTableRequestParams<IListDBAccount, AccountListFilterParamType>();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IAuthListDBAccountParams = {
        ...tableFilterInfo,
        ...pagination,
        project_uid: projectID,
        fuzzy_keyword: searchKeyword
      };
      return handleTableRequestError(
        dbAccountService.AuthListDBAccount(params)
      );
    },
    {
      refreshDeps: [projectID, tableFilterInfo, pagination, searchKeyword]
    }
  );

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'provision_account_list',
      username: username
    }),
    [username]
  );

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListDBAccount, FilterCustomProps>([
      [
        'expired_time',
        {
          showTime: true
        }
      ],
      [
        'status',
        {
          options: DBAccountStatusOptions
        }
      ],
      [
        'platform_managed',
        {
          options: DBAccountPasswordManagedOptions
        }
      ],
      [
        'auth_users',
        {
          options: userIDOptions
        }
      ],
      [
        'db_service',
        {
          options: serviceOptions,
          value: tableFilterInfo.filter_by_db_service
        }
      ]
    ]);
  }, [userIDOptions, serviceOptions, tableFilterInfo]);

  const onUpdateFilter = useCallback(
    (key: keyof AccountListFilterParamType, value: string) => {
      updateAllSelectedFilterItem(true);
      updateTableFilterInfo({
        ...tableFilterInfo,
        [key]: value
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableFilterInfo]
  );

  const columns = useMemo(() => {
    return AccountListColumns(onUpdateFilter);
  }, [onUpdateFilter]);

  const actions = useMemo(() => {
    return AccountListActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo, ExtraFilterMeta());

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    updateUserList();
    updateServiceList();
  }, [updateUserList, updateServiceList]);

  useEffect(() => {
    initModalStatus({
      [ModalName.AccountDiscoveryModal]: false
    });
  }, [initModalStatus]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EventEmitterKey.Refresh_Account_Management_List_Table,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <>
      <PageHeader
        title={t('account.list.title')}
        extra={
          <Space>
            <BasicButton
              onClick={() => toggleModal(ModalName.AccountDiscoveryModal, true)}
            >
              {t('account.list.findAccount')}
            </BasicButton>
            <Link
              to={`/provision/project/${projectID}/account-management/create`}
            >
              <BasicButton type="primary">
                {t('account.list.createAccount')}
              </BasicButton>
            </Link>
          </Space>
        }
      />
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        actions={[
          {
            key: 'modifyPassword',
            text: t('account.list.batchAction.modifyPassword'),
            buttonProps: {
              disabled: selectedRowKeys?.length === 0
            }
          }
        ]}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        setting={tableSetting}
        searchInput={{
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
        loading={loading}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        rowKey="db_account_uid"
        setting={tableSetting}
        dataSource={data?.list ?? []}
        pagination={{
          total: data?.total || 0
        }}
        loading={loading}
        columns={columns}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
        actions={actions}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
      />
      <AccountDiscoveryModal />
    </>
  );
};

export default AccountList;
