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
import { useMemo, useEffect, useCallback } from 'react';
import {
  ExpirationAccountListColumns,
  ExpirationAccountListFilterParamType,
  ExpirationAccountListActions
} from './column';
import useServiceOptions from '~/hooks/useServiceOptions';
import useModalStatus from '~/hooks/useModalStatus';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountSelectData
} from '~/store/databaseAccount';
import { EventEmitterKey, ModalName } from '~/data/enum';
import EventEmitter from '~/utils/EventEmitter';
import ModifyPasswordModal from '../../DatabaseAccount/Modal/ModifyPassword';
import RenewalPasswordModal from '../../DatabaseAccount/Modal/RenewalPassword';
import { useSetRecoilState } from 'recoil';
import useSecurityPolicy from '~/hooks/useSecurityPolicy';
import dayjs from 'dayjs';

const ExpirationAccountList = () => {
  const { projectID } = useCurrentProject();

  const { username } = useCurrentUser();

  const { updateServiceList, serviceOptions } = useServiceOptions();

  const { updateSecurityPolicyList, securityPolicyOptions } =
    useSecurityPolicy();

  const { toggleModal, initModalStatus } = useModalStatus(
    DatabaseAccountModalStatus
  );

  const updateSelectData = useSetRecoilState(DatabaseAccountSelectData);

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
    ExpirationAccountListFilterParamType
  >();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IAuthListDBAccountParams = {
        ...tableFilterInfo,
        ...pagination,
        filter_by_expired_time_from: '',
        filter_by_expired_time_to: dayjs()
          .add(5, 'day')
          .format('YYYY-MM-DDTHH:mm:ssZ'),
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
      tableName: 'expiration_account_list',
      username: username
    }),
    [username]
  );

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListDBAccount, FilterCustomProps>([
      [
        'db_service',
        {
          options: serviceOptions,
          value: tableFilterInfo.filter_by_db_service
        }
      ],
      [
        'password_security_policy',
        {
          options: securityPolicyOptions(false),
          value: tableFilterInfo.filter_by_policy
        }
      ]
    ]);
  }, [serviceOptions, tableFilterInfo, securityPolicyOptions]);

  const onUpdateFilter = useCallback(
    (key: keyof ExpirationAccountListFilterParamType, value: string) => {
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
    return ExpirationAccountListColumns(onUpdateFilter);
  }, [onUpdateFilter]);

  const onOpenModal = useCallback(
    (name: ModalName, record?: IListDBAccount) => {
      toggleModal(name, true);
      updateSelectData(record ?? null);
    },
    [toggleModal, updateSelectData]
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  useEffect(() => {
    updateServiceList();
    updateSecurityPolicyList();
  }, [updateServiceList, updateSecurityPolicyList]);

  useEffect(() => {
    initModalStatus({
      [ModalName.DatabaseAccountModifyPasswordModal]: false,
      [ModalName.DatabaseAccountRenewalPasswordModal]: false
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
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
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
        actions={ExpirationAccountListActions(onOpenModal)}
      />
      <ModifyPasswordModal />
      <RenewalPasswordModal />
    </>
  );
};

export default ExpirationAccountList;
