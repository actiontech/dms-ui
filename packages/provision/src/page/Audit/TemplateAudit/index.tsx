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
  eventType,
  TemplateAuditTableActions
} from './columns';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import TemplateAuditDetailDrawer from './DetailDrawer';
import { useBoolean } from 'ahooks';
import useProvisionUser from '~/hooks/useProvisionUser';
import useServiceOptions from '~/hooks/useServiceOptions';

const TemplateAudit: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [
    open,
    { setTrue: setShowDetailDrawer, setFalse: setHideDetailDrawer }
  ] = useBoolean();

  const [currentDetail, setCurrentDetail] =
    useState<IListDataPermissionTemplateEvent>();

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
        keyword: searchKeyword
      };
      return handleTableRequestError(
        auth.AuditListDataPermissionTemplateEvents(params)
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo, projectID]
    }
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(TemplateAuditTableColumns, updateTableFilterInfo);

  const { userNameOptions, updateUserList } = useProvisionUser();

  const { serviceNameOptions, updateServiceList } = useServiceOptions();

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListDataPermissionTemplateEvent, FilterCustomProps>([
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
        'executing_user_name',
        {
          options: userNameOptions
        }
      ],
      [
        'data_permissions',
        {
          options: serviceNameOptions
        }
      ]
    ]);
  }, [userNameOptions, serviceNameOptions]);

  const gotoDetail = useCallback(
    (record?: IListDataPermissionTemplateEvent) => {
      setCurrentDetail(record);
      setShowDetailDrawer();
    },
    [setShowDetailDrawer]
  );

  const actions = useMemo(() => {
    return TemplateAuditTableActions(gotoDetail);
  }, [gotoDetail]);

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
        columns={TemplateAuditTableColumns}
        onChange={tableChange}
        errorMessage={requestErrorMessage}
        actions={actions}
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
