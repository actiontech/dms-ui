import {
  ActiontechTable,
  useTableFilterContainer,
  useTableRequestError,
  TableFilterContainer,
  TableToolbar,
  FilterCustomProps,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import AuthStatusFilter from './AuthStatusFilter';
import { message } from 'antd';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { useSetRecoilState } from 'recoil';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useModalStatus from '~/hooks/useModalStatus';
import useListTipsByAuthKey from '~/hooks/useListTipsByAuthKey';

import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { AuthListAuthorizationFilterByStatusEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IListAuthorization } from '@actiontech/shared/lib/api/provision/service/common.d';
import { IAuthListAuthorizationParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import {
  AuthListFilterParamType,
  AuthTableColumns,
  AuthTableActions
} from './columns';
import EventEmitter from '~/utils/EventEmitter';
import { EventEmitterKey, ModalName } from '~/data/enum';

import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';

const AuthListItem = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();
  const [authStatus, setAuthStatus] = useState<
    AuthListAuthorizationFilterByStatusEnum | 'all'
  >('all');

  const navigate = useNavigate();
  const { purpose: defaultPurpose } = useParams();

  const [messageApi, contextHolder] = message.useMessage();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const { tableFilterInfo, updateTableFilterInfo, tableChange, pagination } =
    useTableRequestParams<IListAuthorization, AuthListFilterParamType>();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IAuthListAuthorizationParams = {
        ...tableFilterInfo,
        ...pagination,
        filter_by_status: authStatus === 'all' ? undefined : authStatus,
        filter_by_namespace_uid: projectID
      };
      return handleTableRequestError(auth.AuthListAuthorization(params));
    },
    {
      refreshDeps: [projectID, tableFilterInfo, pagination, authStatus]
    }
  );

  const onRecovery = useCallback(
    (record?: IListAuthorization) => {
      auth
        .AuthDelAuthorization({
          authorization_uid: record?.uid ?? ''
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('auth.deleteAuth.success'));
            refresh();
          }
        });
    },
    [messageApi, t, refresh]
  );

  const { toggleModal, initModalStatus } = useModalStatus(AuthListModalStatus);

  const updateSelectData = useSetRecoilState(AuthListSelectData);

  const openModal = useCallback(
    (record: IListAuthorization, name: ModalName) => {
      toggleModal(name, true);
      updateSelectData(record);
    },
    [toggleModal, updateSelectData]
  );

  const actions = useMemo(() => {
    return AuthTableActions(onRecovery, openModal);
  }, [onRecovery, openModal]);

  const columns = useMemo(() => {
    return AuthTableColumns(projectID, navigate, openModal);
  }, [projectID, navigate, openModal]);

  const { purposeOptions, businessOptions, serviceOptions } =
    useListTipsByAuthKey();

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListAuthorization, FilterCustomProps>([
      [
        'purpose',
        {
          options: purposeOptions,
          defaultValue: defaultPurpose
        }
      ],
      [
        'businesses',
        {
          options: businessOptions
        }
      ],
      [
        'data_object_service',
        {
          options: serviceOptions
        }
      ]
    ]);
  }, [purposeOptions, businessOptions, serviceOptions, defaultPurpose]);
  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  useEffect(() => {
    initModalStatus({
      [ModalName.GetConnection]: false,
      [ModalName.UpdateTemplateInAuth]: false,
      [ModalName.UpdateUserInAuth]: false,
      [ModalName.UpdateExpirationInAuth]: false
    });
  }, [initModalStatus]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EventEmitterKey.Refresh_Auth_List_Table,
      () => {
        refresh();
      }
    );
    return unsubscribe;
  }, [refresh]);

  useEffect(() => {
    if (!!defaultPurpose) {
      updateAllSelectedFilterItem(true);
      updateTableFilterInfo({
        filter_by_purpose: defaultPurpose
      });
    }
  }, [updateTableFilterInfo, defaultPurpose, updateAllSelectedFilterItem]);

  return (
    <>
      {contextHolder}
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
      >
        <AuthStatusFilter status={authStatus} onChange={setAuthStatus} />
      </TableToolbar>
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        rowKey="event_uid"
        dataSource={data?.list}
        pagination={{
          total: data?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
        actions={actions}
      />
    </>
  );
};

export default AuthListItem;
