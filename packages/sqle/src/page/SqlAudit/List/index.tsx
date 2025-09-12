import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { useTypedQuery } from '@actiontech/shared';
import {
  ActiontechTable,
  useTableFilterContainer,
  useTableRequestError,
  TableFilterContainer,
  TableToolbar,
  FilterCustomProps,
  ColumnsSettingProps,
  useTableRequestParams,
  ActiontechTableWrapper
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import { ResponseCode } from '../../../data/common';
import useInstance from '../../../hooks/useInstance';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { IGetSQLAuditRecordsV1Params } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.d';
import { ISQLAuditRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import SqlAuditListColumn, {
  type SqlAuditListTableFilterParamType
} from './column';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import { useBoolean } from 'ahooks';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { ISQLAuditRecordExtraParams } from './index.type';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { sqlAuditStatusOptions } from './index.data';

const SqlAuditList = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName, projectID } = useCurrentProject();
  const { username } = useCurrentUser();
  const extractQueries = useTypedQuery();

  const [polling, { setFalse: finishPollRequest, setTrue: startPollRequest }] =
    useBoolean();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    ISQLAuditRecord,
    SqlAuditListTableFilterParamType
  >();
  const filterDataFromUrl = useMemo(() => {
    const searchStr = extractQueries(ROUTE_PATHS.SQLE.SQL_AUDIT.index);
    if (searchStr?.sql_audit_record_id) {
      return searchStr.sql_audit_record_id ?? undefined;
    }
  }, [extractQueries]);

  const { instanceIDOptions, updateInstanceList } = useInstance();

  const {
    data: dataList,
    loading,
    refresh,
    cancel
  } = useRequest(
    () => {
      const params: IGetSQLAuditRecordsV1Params = {
        ...tableFilterInfo,
        ...pagination,
        project_name: projectName,
        fuzzy_search_tags: searchKeyword,
        filter_sql_audit_record_ids: filterDataFromUrl
      };

      return handleTableRequestError(
        sql_audit_record.getSQLAuditRecordsV1(params)
      );
    },
    {
      refreshDeps: [tableFilterInfo, pagination, filterDataFromUrl],
      pollingInterval: 1000,
      pollingErrorRetryCount: 3,
      onSuccess: (res) => {
        if (
          res.list?.some(
            (i) =>
              i.sql_audit_status ===
              getSQLAuditRecordsV1FilterSqlAuditStatusEnum.auditing
          )
        ) {
          startPollRequest();
        } else {
          cancel();
          finishPollRequest();
        }
      }
    }
  );

  const updateTags = useCallback(
    async (tags: string[], id: string) => {
      sql_audit_record
        .updateSQLAuditRecordV1({
          tags,
          sql_audit_record_id: id,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('sqlAudit.list.action.updateTags.successTips')
            );
            refresh();
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectName]
  );

  const columns = useMemo(
    () => SqlAuditListColumn(projectID, projectName, updateTags),
    [projectID, projectName, updateTags]
  );
  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'sql_audit_record_list',
      username: username
    }),
    [username]
  );
  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer<
      ISQLAuditRecordExtraParams,
      SqlAuditListTableFilterParamType,
      'instance' | 'score' | 'audit_pass_rate'
    >(columns, updateTableFilterInfo);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof ISQLAuditRecord, FilterCustomProps>([
      ['instance', { options: instanceIDOptions }],
      [
        'created_at',
        {
          showTime: true
        }
      ],
      ['sql_audit_status', { options: sqlAuditStatusOptions }]
    ]);
  }, [instanceIDOptions]);

  useEffect(() => {
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList]);

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Sql_Audit_List,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  const pageLoading = useMemo(
    () => (polling ? false : loading),
    [polling, loading]
  );

  return (
    <>
      {messageContextHolder}
      {/* table */}
      <ActiontechTableWrapper loading={pageLoading} setting={tableSetting}>
        <TableToolbar
          filterButton={{
            filterButtonMeta,
            updateAllSelectedFilterItem
          }}
          searchInput={{
            onChange: setSearchKeyword,
            onSearch: () => {
              refreshBySearchKeyword();
            },
            placeholder: t('sqlAudit.list.filter.inputTagPlaceholder')
          }}
        />
        <TableFilterContainer
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          disabled={pageLoading}
          filterCustomProps={filterCustomProps}
        />
        <ActiontechTable
          dataSource={dataList?.list}
          rowKey={(record: ISQLAuditRecord) => {
            return `${record?.sql_audit_record_id}`;
          }}
          pagination={{
            total: dataList?.total ?? 0,
            current: pagination.page_index
          }}
          columns={columns}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
        />
      </ActiontechTableWrapper>
    </>
  );
};

export default SqlAuditList;
