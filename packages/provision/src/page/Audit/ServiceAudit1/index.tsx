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
import { IAuditListDataObjectServiceEventsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { IListDataObjectServiceEvent } from '@actiontech/shared/lib/api/provision/service/common';
import { useRequest } from 'ahooks';
import {
  ServiceAuditTableFilterParamType,
  ServiceAuditTableColumns,
  ServiceAuditTableActions
} from './columns';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import ServiceAuditDetailDrawer from './DetailDrawer';
import { useBoolean } from 'ahooks';

const ServiceAudit: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [open, { set }] = useBoolean();

  const [currentDetail, setCurrentDetail] =
    useState<IListDataObjectServiceEvent>();

  const { tableFilterInfo, updateTableFilterInfo, tableChange, pagination } =
    useTableRequestParams<
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
        filter_by_namespace_uid: projectID
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

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListDataObjectServiceEvent, FilterCustomProps>([
      [
        'generated_time',
        {
          showTime: true
        }
      ]
    ]);
  }, []);

  const gotoDetail = useCallback(
    (record?: IListDataObjectServiceEvent) => {
      setCurrentDetail(record);
      set(true);
    },
    [set]
  );

  const actions = useMemo(() => {
    return ServiceAuditTableActions(gotoDetail);
  }, [gotoDetail]);

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
          onSearch: (value) => {
            // todo 需后端提供接口
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
        columns={ServiceAuditTableColumns}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
        actions={actions}
      />
      <ServiceAuditDetailDrawer
        open={open}
        data={currentDetail}
        onClose={() => set(false)}
      />
    </div>
  );
};

export default ServiceAudit;
