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

const AuthAudit: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [open, { set }] = useBoolean();

  const [currentDetail, setCurrentDetail] = useState<IListAuthorizationEvent>();

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
        filter_by_namespace_uid: projectID
      };
      return handleTableRequestError(auth.AuditListAuthorizationEvents(params));
    },
    {
      refreshDeps: [pagination, tableFilterInfo, projectID]
    }
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(AuthAuditTableColumns, updateTableFilterInfo);

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
      ]
    ]);
  }, []);

  const gotoDetail = useCallback(
    (record?: IListAuthorizationEvent) => {
      setCurrentDetail(record);
      set(true);
    },
    [set]
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
          onSearch: (value) => {
            console.log('search--->', value);
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
        onClose={() => set(false)}
      />
    </div>
  );
};

export default AuthAudit;
