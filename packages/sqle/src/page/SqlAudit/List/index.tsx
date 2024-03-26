import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { message } from 'antd';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
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
import SqlAuditStatusFilter from './component/SqlAuditStatusFilter';

import { useRequest } from 'ahooks';
import { ResponseCode } from '../../../data/common';
import useInstance from '../../../hooks/useInstance';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { IGetSQLAuditRecordsV1Params } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.d';
import { ISQLAuditRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import SqlAuditListColumn, {
  ExtraFilterMeta,
  type SqlAuditListTableFilterParamType
} from './column';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import { SQLAuditRecordListUrlParamsKey } from '../../SqlManagement/component/SQLEEIndex/index.data';

const SqlAuditList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName, projectID, projectArchive } = useCurrentProject();
  const { username } = useCurrentUser();

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
    const searchStr = new URLSearchParams(location.search);
    if (searchStr.has(SQLAuditRecordListUrlParamsKey.SQLAuditRecordID)) {
      return (
        searchStr.get(SQLAuditRecordListUrlParamsKey.SQLAuditRecordID) ?? ''
      );
    }
    return '';
  }, [location.search]);
  const [filterStatus, setFilterStatus] = useState<
    getSQLAuditRecordsV1FilterSqlAuditStatusEnum | 'all'
  >('all');

  const { instanceIDOptions, updateInstanceList } = useInstance();

  const {
    data: dataList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetSQLAuditRecordsV1Params = {
        ...tableFilterInfo,
        ...pagination,
        filter_sql_audit_status:
          filterStatus === 'all' ? undefined : filterStatus,
        project_name: projectName,
        fuzzy_search_tags: searchKeyword,
        filter_sql_audit_record_ids: filterDataFromUrl
      };

      return handleTableRequestError(
        sql_audit_record.getSQLAuditRecordsV1(params)
      );
    },
    {
      refreshDeps: [
        tableFilterInfo,
        pagination,
        filterStatus,
        filterDataFromUrl
      ]
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
    useTableFilterContainer(columns, updateTableFilterInfo, ExtraFilterMeta());
  const filterCustomProps = useMemo(() => {
    return new Map<
      keyof (ISQLAuditRecord & {
        instance_name?: string;
        auditTime?: string;
      }),
      FilterCustomProps
    >([
      ['instance_name', { options: instanceIDOptions }],
      [
        'auditTime',
        {
          showTime: true
        }
      ]
    ]);
  }, [instanceIDOptions]);

  useEffect(() => {
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList]);

  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={t('sqlAudit.list.pageTitle')}
        fixed
        extra={
          !projectArchive ? (
            <Link to={`/sqle/project/${projectID}/sql-audit/create`}>
              <BasicButton type="primary" icon={<IconAdd />}>
                {t('sqlAudit.list.action.create')}
              </BasicButton>
            </Link>
          ) : null
        }
      />
      <div className="margin-top-60" />
      {/* table */}
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        setting={tableSetting}
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
        loading={loading}
      >
        <SqlAuditStatusFilter
          status={filterStatus}
          onChange={setFilterStatus}
        />
      </TableToolbar>
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        setting={tableSetting}
        dataSource={dataList?.list}
        rowKey={(record: ISQLAuditRecord) => {
          return `${record?.sql_audit_record_id}`;
        }}
        pagination={{
          total: dataList?.total ?? 0,
          current: pagination.page_index
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </>
  );
};

export default SqlAuditList;
