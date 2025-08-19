import { useRequest } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import { IOptimizationRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  useCurrentProject,
  useCurrentUser,
  useDbServiceDriver
} from '@actiontech/shared/lib/features';
import useInstance from '../../../hooks/useInstance';
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
import { SqleApi } from '@actiontech/shared/lib/api';
import { IGetOptimizationRecordsParams } from '@actiontech/shared/lib/api/sqle/service/sql_optimization/index.d';
import {
  useTypedNavigate,
  BasicToolTip,
  ActiontechTableWrapper
} from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { SqlOptimizationListStyleWrapper } from '../style';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { SqlOptimizationListActions } from './actions';

const SqlOptimizationList = () => {
  const navigate = useTypedNavigate();

  const { t } = useTranslation();

  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const { projectName, projectID } = useCurrentProject();

  const { username } = useCurrentUser();

  const { getLogoUrlByDbType, updateDriverList } = useDbServiceDriver();

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

  const { data, loading, refresh, cancel, run } = useRequest(
    () => {
      const params: IGetOptimizationRecordsParams = {
        ...pagination,
        ...tableFilterInfo,
        project_name: projectName,
        fuzzy_search: searchKeyword
      };
      return handleTableRequestError(
        SqleApi.SqlOptimizationService.GetOptimizationRecordsV2(params)
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo],
      pollingInterval: 5000,
      onError: () => {
        cancel();
      }
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

  const onView = (record?: IOptimizationRecord) => {
    navigate(ROUTE_PATHS.SQLE.SQL_AUDIT.optimization_result, {
      params: {
        projectID,
        optimizationId: record?.optimization_id ?? ''
      }
    });
  };

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  useEffect(() => {
    updateDriverList();
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList, updateDriverList]);

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Sql_Optimization_List,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <SqlOptimizationListStyleWrapper>
      <ActiontechTableWrapper loading={loading} setting={tableSetting}>
        <TableToolbar
          filterButton={{
            filterButtonMeta,
            updateAllSelectedFilterItem
          }}
          actions={[
            {
              key: 'auto-refresh',
              text: (
                <BasicToolTip
                  title={
                    autoRefreshEnabled
                      ? t('sqlOptimization.table.closeAutoRefreshTips')
                      : t('sqlOptimization.table.openAutoRefreshTips')
                  }
                >
                  {t('sqlOptimization.table.autoRefresh')}
                </BasicToolTip>
              ),
              buttonProps: {
                className: classNames({
                  'switch-btn-active': autoRefreshEnabled
                }),
                onClick: () => {
                  if (autoRefreshEnabled) {
                    cancel();
                  } else {
                    run();
                  }
                  setAutoRefreshEnabled(!autoRefreshEnabled);
                }
              }
            }
          ]}
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
          actions={SqlOptimizationListActions(onView)}
        />
      </ActiontechTableWrapper>
    </SqlOptimizationListStyleWrapper>
  );
};

export default SqlOptimizationList;
