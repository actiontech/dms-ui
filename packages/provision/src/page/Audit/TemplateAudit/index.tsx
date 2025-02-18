import { useMemo, useCallback, useState, useEffect } from 'react';
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
import { IAuditListDataPermissionTemplateEventsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { IListDataPermissionTemplateEvent } from '@actiontech/shared/lib/api/provision/service/common';
import { useRequest } from 'ahooks';
import {
  TemplateAuditTableFilterParamType,
  TemplateAuditTableColumns,
  TemplateAuditTableActions
} from './columns';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import TemplateAuditDetailDrawer from './DetailDrawer';
import { useBoolean } from 'ahooks';
import useProvisionUser from '~/hooks/useProvisionUser';
import useServiceOptions from '~/hooks/useServiceOptions';
import { EventTypeEnum } from './components/EventType';
import EventTypeFilter from './components/EventTypeFilter';

const TemplateAudit: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [
    open,
    { setTrue: setShowDetailDrawer, setFalse: setHideDetailDrawer }
  ] = useBoolean();

  const [currentDetail, setCurrentDetail] =
    useState<IListDataPermissionTemplateEvent>();

  const [filterStatus, setFilterStatus] = useState<EventTypeEnum | 'all'>(
    'all'
  );
  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IListDataPermissionTemplateEvent,
    TemplateAuditTableFilterParamType
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IAuditListDataPermissionTemplateEventsParams = {
        ...pagination,
        ...tableFilterInfo,
        filter_by_namespace_uid: projectID,
        keyword: searchKeyword,
        filter_by_event_type:
          filterStatus === 'all'
            ? undefined
            : (filterStatus as unknown as EventTypeEnum)
      };
      return handleTableRequestError(
        auth.AuditListDataPermissionTemplateEvents(params)
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo, projectID, filterStatus]
    }
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(TemplateAuditTableColumns, updateTableFilterInfo);

  const {
    userNameOptions,
    updateUserList,
    loading: provisionUserLoading
  } = useProvisionUser();

  const {
    serviceNameOptions,
    updateServiceList,
    loading: serviceUserLoading
  } = useServiceOptions();

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListDataPermissionTemplateEvent, FilterCustomProps>([
      [
        'generated_time',
        {
          showTime: true
        }
      ],
      [
        'executing_user_name',
        {
          options: userNameOptions,
          loading: provisionUserLoading
        }
      ],
      [
        'data_permissions',
        {
          options: serviceNameOptions,
          loading: serviceUserLoading
        }
      ]
    ]);
  }, [
    userNameOptions,
    serviceNameOptions,
    provisionUserLoading,
    serviceUserLoading
  ]);

  const gotoDetail = useCallback(
    (record?: IListDataPermissionTemplateEvent) => {
      setCurrentDetail(record);
      setShowDetailDrawer();
    },
    [setShowDetailDrawer]
  );

  useEffect(() => {
    updateServiceList();
    updateUserList();
  }, [updateServiceList, updateUserList]);

  return (
    <div>
      <PageHeader title={t('provisionAudit.templateAudit.title')} />
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
      >
        <EventTypeFilter eventType={filterStatus} onChange={setFilterStatus} />
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
          total: data?.total ?? 0,
          current: pagination.page_index
        }}
        loading={loading}
        columns={TemplateAuditTableColumns}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
        actions={TemplateAuditTableActions(gotoDetail)}
      />
      <TemplateAuditDetailDrawer
        open={open}
        data={currentDetail}
        onClose={() => setHideDetailDrawer()}
      />
    </div>
  );
};

export default TemplateAudit;
