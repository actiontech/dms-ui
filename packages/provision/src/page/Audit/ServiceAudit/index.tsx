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
import { IAuditListDataObjectServiceEventsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { IListDataObjectServiceEvent } from '@actiontech/shared/lib/api/provision/service/common';
import { useRequest } from 'ahooks';
import {
  ServiceAuditTableFilterParamType,
  ServiceAuditTableColumns,
  ServiceAuditTableActions
} from './columns';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import ServiceAuditDetailDrawer from './DetailDrawer';
import { useBoolean } from 'ahooks';
import useServiceOptions from '~/hooks/useServiceOptions';
import useBusinessOptions from '~/hooks/useBusinessOptions';

const ServiceAudit: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [
    open,
    { setTrue: setShowDetailDrawer, setFalse: setHideDetailDrawer }
  ] = useBoolean();

  const [currentDetail, setCurrentDetail] =
    useState<IListDataObjectServiceEvent>();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IListDataObjectServiceEvent,
    ServiceAuditTableFilterParamType
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IAuditListDataObjectServiceEventsParams = {
        ...pagination,
        ...tableFilterInfo,
        filter_by_namespace_uid: projectID,
        keyword: searchKeyword
      };
      return handleTableRequestError(
        auth.AuditListDataObjectServiceEvents(params)
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo, projectID]
    }
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(ServiceAuditTableColumns, updateTableFilterInfo);

  const { serviceNameOptions, updateServiceList } = useServiceOptions();

  const { businessOptions, updateBusinessList } = useBusinessOptions();

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListDataObjectServiceEvent, FilterCustomProps>([
      [
        'generated_time',
        {
          showTime: true
        }
      ],
      [
        'business',
        {
          options: businessOptions,
          onChange: (business: string) => {
            updateServiceList(business);
          }
        }
      ],
      [
        'data_object_service_name',
        {
          options: serviceNameOptions
        }
      ]
    ]);
  }, [businessOptions, serviceNameOptions, updateServiceList]);

  const gotoDetail = useCallback(
    (record?: IListDataObjectServiceEvent) => {
      setCurrentDetail(record);
      setShowDetailDrawer();
    },
    [setShowDetailDrawer]
  );

  useEffect(() => {
    updateServiceList();
    updateBusinessList();
  }, [updateBusinessList, updateServiceList]);

  return (
    <div>
      <PageHeader title={t('provisionAudit.serviceAudit.title')} />
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
          total: data?.total ?? 0,
          current: pagination.page_index
        }}
        loading={loading}
        columns={ServiceAuditTableColumns}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
        actions={ServiceAuditTableActions(gotoDetail)}
      />
      <ServiceAuditDetailDrawer
        open={open}
        data={currentDetail}
        onClose={() => setHideDetailDrawer()}
      />
    </div>
  );
};

export default ServiceAudit;
