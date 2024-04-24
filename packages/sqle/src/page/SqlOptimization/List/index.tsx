import { useRequest } from 'ahooks';
import { useEffect, useMemo } from 'react';
import { IOptimizationRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  useCurrentProject,
  useCurrentUser,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import useInstance from '../../../hooks/useInstance';
import { EmptyBox } from '@actiontech/shared';
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
import {
  SqlOptimizationListTableFilterParamType,
  SqlOptimizationListColumns
} from './columns';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { IGetOptimizationRecordsParams } from '@actiontech/shared/lib/api/sqle/service/sql_optimization/index.d';
import { PageHeader, BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { OpPermissionTypeUid } from '@actiontech/shared/lib/enum';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { Link, useNavigate } from 'react-router-dom';

const SqlOptimizationList = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { projectName, projectID } = useCurrentProject();

  const { username, isAdmin, managementPermissions } = useCurrentUser();

  const { getLogoUrlByDbType, updateDriverList } = useDbServiceDriver();

  const allowCreateOptimizationTask = useMemo(() => {
    return (
      isAdmin ||
      managementPermissions.some(
        (v) => OpPermissionTypeUid['create_optimization'] === (v?.uid ?? '')
      )
    );
  }, [isAdmin, managementPermissions]);

  const { instanceOptions, updateInstanceList } = useInstance();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IOptimizationRecord,
    SqlOptimizationListTableFilterParamType
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IGetOptimizationRecordsParams = {
        ...pagination,
        ...tableFilterInfo,
        project_name: projectName,
        fuzzy_search: searchKeyword
      };
      return handleTableRequestError(
        sqlOptimization.getOptimizationRecords(params)
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'sql_optimization_list',
      username: username
    }),
    [username]
  );

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IOptimizationRecord, FilterCustomProps>([
      [
        'instance_name',
        {
          options: instanceOptions
        }
      ]
    ]);
  }, [instanceOptions]);

  const columns = useMemo(() => {
    return SqlOptimizationListColumns(getLogoUrlByDbType);
  }, [getLogoUrlByDbType]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  useEffect(() => {
    updateDriverList();
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList, updateDriverList]);

  return (
    <>
      <PageHeader
        title={t('sqlOptimization.pageTitle')}
        extra={
          <EmptyBox if={allowCreateOptimizationTask}>
            <Link to={`/sqle/project/${projectID}/sql-optimization/create`}>
              <BasicButton type="primary" icon={<IconAdd />}>
                {t('sqlOptimization.create.linkButton')}
              </BasicButton>
            </Link>
          </EmptyBox>
        }
      />
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
          }
        }}
        loading={loading}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        className="table-row-cursor"
        setting={tableSetting}
        dataSource={data?.list}
        rowKey={(record: IOptimizationRecord) => {
          return `${record?.optimization_id}`;
        }}
        pagination={{
          total: data?.total ?? 0,
          current: pagination.page_index
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        onRow={(record) => {
          return {
            onClick() {
              navigate(
                `/sqle/project/${projectID}/sql-optimization/overview/${record.optimization_id}`
              );
            }
          };
        }}
      />
    </>
  );
};

export default SqlOptimizationList;
