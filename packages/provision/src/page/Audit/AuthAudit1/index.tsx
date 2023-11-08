import { useMemo, useCallback, useState } from 'react';
import { PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import {
  ActiontechTable,
  useTableRequestParams,
  useTableRequestError,
  TableFilterContainer,
  useTableFilterContainer,
  FilterCustomProps,
  TableToolbar
} from '@actiontech/shared/lib/components/ActiontechTable';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IAuditListAuthorizationEventsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { IListAuthorizationEvent } from '@actiontech/shared/lib/api/provision/service/common';
import { useRequest } from 'ahooks';
import {
  AuthAuditTableFilterParamType,
  AuthAuditTableColumns,
  eventType,
  AuthAuditTableActions
} from './columns';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import AuthAuditDetailDrawer from './DetailDrawer';
import { useBoolean } from 'ahooks';
import useProvisionUser from '~/hooks/uerProvisionUser';

const AuthAudit: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [
    open,
    { setTrue: setShowDetailDrawer, setFalse: setHideDetailDrawer }
  ] = useBoolean();

  const [currentDetail, setCurrentDetail] = useState<IListAuthorizationEvent>();

  const [searchValue, setSearchValue] = useState<string>();

  const { tableFilterInfo, updateTableFilterInfo, tableChange, pagination } =
    useTableRequestParams<
      IListAuthorizationEvent,
      AuthAuditTableFilterParamType
    >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IAuditListAuthorizationEventsParams = {
        ...pagination,
        ...tableFilterInfo,
        filter_by_namespace_uid: projectID,
        keyword: searchValue
      };
      return handleTableRequestError(auth.AuditListAuthorizationEvents(params));
    },
    {
      refreshDeps: [pagination, tableFilterInfo, projectID, searchValue]
    }
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(AuthAuditTableColumns, updateTableFilterInfo);

  const { userNameOptions } = useProvisionUser();

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListAuthorizationEvent, FilterCustomProps>([
      [
        'generated_time',
        {
          showTime: true
        }
      ],
      [
        'event_type',
        {
          options: Object.entries(eventType).map(([value, label]) => ({
            value,
            label
          })),
          allowClear: true
        }
      ],
      [
        'permission_user_name',
        {
          options: userNameOptions
        }
      ],
      [
        'executing_user_name',
        {
          options: userNameOptions
        }
      ]
    ]);
  }, [userNameOptions]);

  const gotoDetail = useCallback(
    (record?: IListAuthorizationEvent) => {
      setCurrentDetail(record);
      setShowDetailDrawer();
    },
    [setShowDetailDrawer]
  );

  const actions = useMemo(() => {
    return AuthAuditTableActions(gotoDetail);
  }, [gotoDetail]);

  return (
    <div>
      <PageHeader title={t('provisionAudit.authAudit.title')} />
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          onSearch: setSearchValue
        }}
      />
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
        columns={AuthAuditTableColumns}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
        actions={actions}
      />
      <AuthAuditDetailDrawer
        open={open}
        data={currentDetail}
        onClose={() => setHideDetailDrawer()}
      />
    </div>
  );
};

export default AuthAudit;
