import { useTranslation } from 'react-i18next';
import { PageHeader, BasicButton, EmptyBox } from '@actiontech/shared';
import { Space, message, Spin } from 'antd';
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
  useCurrentUser,
  usePermission
} from '@actiontech/shared/lib/global';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { IAuthListDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import { useMemo, useEffect, useState, useCallback } from 'react';
import {
  DatabaseAccountListColumns,
  DatabaseAccountListFilterParamType,
  DatabaseAccountListActions
} from './column';
import {
  DBAccountStatusOptions,
  DBAccountPasswordManagedOptions
} from '../index.data';
import useProvisionUser from '../../../hooks/useProvisionUser';
import useServiceOptions from '../../../hooks/useServiceOptions';
import useModalStatus from '../../../hooks/useModalStatus';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountSelectData,
  DatabaseAccountBatchActionSelectedData
} from '../../../store/databaseAccount';
import { EventEmitterKey, ModalName } from '../../../data/enum';
import EventEmitter from '../../../utils/EventEmitter';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useNavigate } from 'react-router-dom';
import AccountStatistics from '../components/AccountStatistics';
import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const DatabaseAccountList = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const { projectID } = useCurrentProject();

  const { username } = useCurrentUser();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { updateUserList, userIDOptions } = useProvisionUser();

  const { updateServiceList, serviceOptions } = useServiceOptions();

  const { checkDbServicePermission } = usePermission();

  const { toggleModal, initModalStatus } = useModalStatus(
    DatabaseAccountModalStatus
  );

  const updateSelectData = useSetRecoilState(DatabaseAccountSelectData);

  const updateBatchActionSelectedData = useSetRecoilState(
    DatabaseAccountBatchActionSelectedData
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
  } = useTableRequestParams<
    IListDBAccount,
    DatabaseAccountListFilterParamType
  >();

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

  const {
    data: accountStatic,
    loading: accountStaticLoading,
    refresh: refreshAccountStatic
  } = useRequest(() =>
    dbAccountService
      .AuthGetAccountStatics({ project_uid: projectID })
      .then((res) => res.data.data)
  );

  const onRefresh = useCallback(() => {
    refreshAccountStatic();
    refresh();
  }, [refreshAccountStatic, refresh]);

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'provision_database_account_list',
      username: username
    }),
    [username]
  );

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListDBAccount, FilterCustomProps>([
      [
        'expired_time',
        {
          showTime: true,
          disabledDate: undefined
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
          options: userIDOptions,
          value: tableFilterInfo.filter_by_user
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
    (key: keyof DatabaseAccountListFilterParamType, value?: string) => {
      updateAllSelectedFilterItem(true);
      updateTableFilterInfo({
        ...tableFilterInfo,
        [key]: value
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableFilterInfo]
  );

  const onSetLockedStatus = useCallback(
    (lock: boolean, id?: string) => {
      dbAccountService
        .AuthUpdateDBAccount({
          project_uid: projectID,
          db_account_uid: id ?? '',
          db_account: {
            lock
          }
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              lock
                ? t('databaseAccount.list.lockSuccessTips')
                : t('databaseAccount.list.unlockSuccessTips')
            );
            onRefresh();
          }
        });
    },
    [messageApi, projectID, onRefresh, t]
  );

  const onSetManagedStatus = useCallback(
    (managed: boolean, id?: string) => {
      dbAccountService
        .AuthUpdateDBAccount({
          project_uid: projectID,
          db_account_uid: id ?? '',
          db_account: {
            platform_managed: {
              platform_managed: managed
            }
          }
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('databaseAccount.list.unmanagedSuccessTips'));
            onRefresh();
          }
        });
    },
    [messageApi, projectID, onRefresh, t]
  );

  const onDeleteAccount = useCallback(
    (id?: string) => {
      dbAccountService
        .AuthDelDBAccount({
          project_uid: projectID,
          db_account_uid: id ?? ''
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('databaseAccount.list.deleteSuccessTips'));
            onRefresh();
          }
        });
    },
    [messageApi, projectID, onRefresh, t]
  );

  const columns = useMemo(() => {
    return DatabaseAccountListColumns(onUpdateFilter);
  }, [onUpdateFilter]);

  const onOpenModal = useCallback(
    (name: ModalName, record?: IListDBAccount) => {
      toggleModal(name, true);
      updateSelectData(record ?? null);
    },
    [toggleModal, updateSelectData]
  );

  const onNavigateToUpdatePage = useCallback(
    (id?: string) => {
      navigate(`/provision/project/${projectID}/database-account/update/${id}`);
    },
    [navigate, projectID]
  );

  const actions = useMemo(() => {
    return DatabaseAccountListActions(
      onOpenModal,
      onSetLockedStatus,
      onSetManagedStatus,
      onDeleteAccount,
      onNavigateToUpdatePage,
      (dbServiceId) =>
        checkDbServicePermission(
          OpPermissionItemOpPermissionTypeEnum.auth_db_service_data,
          dbServiceId
        )
    );
  }, [
    onOpenModal,
    onSetLockedStatus,
    onSetManagedStatus,
    onDeleteAccount,
    onNavigateToUpdatePage,
    checkDbServicePermission
  ]);

  const onBatchAction = (name: ModalName) => {
    toggleModal(name, true);
    updateBatchActionSelectedData(
      data?.list?.filter((i) =>
        selectedRowKeys.includes(i.db_account_uid ?? '')
      ) ?? []
    );
  };

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    updateUserList();
    updateServiceList();
  }, [updateUserList, updateServiceList]);

  useEffect(() => {
    initModalStatus({
      [ModalName.DatabaseAccountDiscoveryModal]: false,
      [ModalName.DatabaseAccountDetailModal]: false,
      [ModalName.DatabaseAccountAuthorizeModal]: false,
      [ModalName.DatabaseAccountModifyPasswordModal]: false,
      [ModalName.DatabaseAccountRenewalPasswordModal]: false,
      [ModalName.DatabaseAccountBatchModifyPasswordModal]: false,
      [ModalName.DatabaseAccountManagePasswordModal]: false
    });
  }, [initModalStatus]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EventEmitterKey.Refresh_Account_Management_List_Table,
      (key: keyof DatabaseAccountListFilterParamType, value: string) => {
        if (key && value) {
          onUpdateFilter(key, value);
          refreshAccountStatic();
        } else {
          onRefresh();
        }
      }
    );
    return unsubscribe;
  }, [onRefresh, onUpdateFilter, refreshAccountStatic]);

  return (
    <>
      {contextHolder}
      <PageHeader
        title={t('databaseAccount.list.title')}
        extra={
          <EmptyBox
            if={checkDbServicePermission(
              OpPermissionItemOpPermissionTypeEnum.auth_db_service_data
            )}
          >
            <Space>
              <BasicButton
                onClick={() =>
                  toggleModal(ModalName.DatabaseAccountDiscoveryModal, true)
                }
              >
                {t('databaseAccount.list.findAccount')}
              </BasicButton>
              <Link
                to={`/provision/project/${projectID}/database-account/create`}
              >
                <BasicButton type="primary">
                  {t('databaseAccount.list.createAccount')}
                </BasicButton>
              </Link>
            </Space>
          </EmptyBox>
        }
      />
      <Spin spinning={accountStaticLoading || loading}>
        <AccountStatistics data={accountStatic} />
        <TableToolbar
          refreshButton={{ refresh: onRefresh, disabled: loading }}
          actions={[
            {
              key: 'modifyPassword',
              text: t('databaseAccount.list.batchAction.modifyPassword'),
              buttonProps: {
                disabled: selectedRowKeys?.length === 0,
                onClick: () =>
                  onBatchAction(
                    ModalName.DatabaseAccountBatchModifyPasswordModal
                  )
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
          dataSource={data?.list}
          pagination={{
            total: data?.total || 0
          }}
          columns={columns}
          onChange={tableChange}
          errorMessage={requestErrorMessage}
          actions={actions}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange
          }}
        />
      </Spin>
    </>
  );
};

export default DatabaseAccountList;
