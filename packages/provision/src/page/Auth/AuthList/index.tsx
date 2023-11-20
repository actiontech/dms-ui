import { useCallback, useMemo, useState, useEffect } from 'react';
import { PageHeader, BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import {
  ActiontechTable,
  useTableFilterContainer,
  useTableRequestError,
  TableFilterContainer,
  TableToolbar,
  FilterCustomProps,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IAuthListAuthorizationParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { IListAuthorization } from '@actiontech/shared/lib/api/provision/service/common.d';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  AuthListFilterParamType,
  AuthTableColumns,
  AuthTableActions
} from './columns';
import useListTipsByAuthKey from '~/hooks/useListTipsByAuthKey';
import { useParams, useNavigate } from 'react-router-dom';
import AuthStatusFilter from './components/AuthStatusFilter';
import { AuthListAuthorizationFilterByStatusEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { AuthListStyleWrapper } from './style';
import useModalStatus from '~/hooks/useModalStatus';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { useSetRecoilState } from 'recoil';
import { EventEmitterKey, ModalName } from '~/data/enum';
import EventEmitter from '~/utils/EventEmitter';
import UpdateUserInAuth from './components/UpdateUser';
import UpdateTemplate from './components/UpdateTemplate';
import UpdateExpiration from './components/UpdateExpiration';
import AuthDetailDrawer from './components/AuthDetailDrawer';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { message } from 'antd5';

const AuthList: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [authStatus, setAuthStatus] = useState<
    AuthListAuthorizationFilterByStatusEnum | 'all'
  >('all');

  const { purpose: defaultPurpose } = useParams();

  const navigate = useNavigate();

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

  const { toggleModal, initModalStatus } = useModalStatus(AuthListModalStatus);

  const updateSelectData = useSetRecoilState(AuthListSelectData);

  const openModal = useCallback(
    (record: IListAuthorization, name: ModalName) => {
      toggleModal(name, true);
      updateSelectData(record);
    },
    [toggleModal, updateSelectData]
  );

  const columns = useMemo(() => {
    return AuthTableColumns(projectID, navigate, openModal);
  }, [projectID, navigate, openModal]);

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

  const actions = useMemo(() => {
    return AuthTableActions(onRecovery, openModal);
  }, [onRecovery, openModal]);

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
    <AuthListStyleWrapper>
      {contextHolder}
      <PageHeader
        title={t('auth.list.title')}
        extra={
          <BasicButton
            type="primary"
            onClick={() => {
              navigate(`/provision/project/${projectID}/auth/list/add`);
            }}
          >
            {t('auth.button.addAuth')}
          </BasicButton>
        }
      />
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
      <UpdateUserInAuth />
      <UpdateTemplate />
      <UpdateExpiration />
      <AuthDetailDrawer />
    </AuthListStyleWrapper>
  );
};

export default AuthList;
