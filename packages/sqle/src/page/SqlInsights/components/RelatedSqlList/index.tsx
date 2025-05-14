import { useTranslation } from 'react-i18next';
import { RelatedSqlListStyleWrapper } from './style';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableToolbar,
  TableFilterContainer,
  useTableFilterContainer,
  FilterCustomProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useMemoizedFn, useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import sqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { RelatedSqlListColumn, RelatedSqlListFilterParams } from './column';
import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { EmptyRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { formatTime } from '@actiontech/shared';
import { Space, message } from 'antd';
import { useMemo } from 'react';
import { GetSqlManageSqlPerformanceInsightsRelatedSQLFilterSourceEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { IGetSqlManageSqlPerformanceInsightsRelatedSQLParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../store';
import { relatedSqlTableActions } from './actions';
import { ModalName } from '../../../../data/ModalName';
import {
  updateSqlInsightsModalStatus,
  updateRelateSqlSelectedRecord
} from '../../../../store/sqlInsights';

export interface RelatedSqlListProps {
  instanceId?: string;
}

const RelatedSqlList: React.FC<RelatedSqlListProps> = ({ instanceId }) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const dispatch = useDispatch();
  const dateRange = useSelector(
    (state: IReduxState) => state.sqlInsights.relateSqlList.selectedDateRange
  );
  const {
    tableChange,
    pagination,
    tableFilterInfo,
    updateTableFilterInfo,
    sortInfo,
    createSortParams
  } = useTableRequestParams<IRelatedSQLInfo, RelatedSqlListFilterParams>();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const onAnalyzeSql = useMemoizedFn((record: IRelatedSQLInfo) => {
    message.info('SQL分析功能将在此实现');
    // TODO: 跳转至SQL分析页面，但是现有的设计有两个问题。需要跟具体实现的后端/产品讨论。
    // 1、现有的SQL分析页面需要一个  sqlManageId 参数。但是当前table没有这个感念。
    // 2、现有的SQL分析针对的是具体的SQL，而当前的表针对的是sql指纹。
  });

  const onViewRelatedTransactions = useMemoizedFn((record: IRelatedSQLInfo) => {
    dispatch(
      updateSqlInsightsModalStatus({
        modalName:
          ModalName.Sql_Insights_Related_SQL_Item_Relate_Transaction_Drawer,
        status: true
      })
    );
    dispatch(
      updateRelateSqlSelectedRecord({
        record
      })
    );
  });

  const columns = useMemo(() => {
    return RelatedSqlListColumn();
  }, []);

  const tableActions = useMemo(() => {
    return relatedSqlTableActions(onAnalyzeSql, onViewRelatedTransactions);
  }, [onAnalyzeSql, onViewRelatedTransactions]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer<IRelatedSQLInfo, RelatedSqlListFilterParams>(
      columns,
      updateTableFilterInfo
    );

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IRelatedSQLInfo, FilterCustomProps>([
      [
        'source',
        {
          options: [
            {
              label: t('sqlInsights.relatedSqlList.source.order'),
              value:
                GetSqlManageSqlPerformanceInsightsRelatedSQLFilterSourceEnum.order
            },
            {
              label: t('sqlInsights.relatedSqlList.source.sqlManage'),
              value:
                GetSqlManageSqlPerformanceInsightsRelatedSQLFilterSourceEnum.sql_manage
            }
          ]
        }
      ]
    ]);
  }, [t]);

  const {
    data: listData,
    loading,
    refresh: refreshData
  } = useRequest(
    () => {
      if (!dateRange) {
        return Promise.resolve<{
          list?: IRelatedSQLInfo[];
          total: number;
        }>({
          list: [],
          total: 0
        });
      }
      const params: IGetSqlManageSqlPerformanceInsightsRelatedSQLParams = {
        project_name: projectName,
        instance_name: instanceId ?? '',
        start_time: dateRange?.[0].format('YYYY-MM-DD HH:mm:ss') ?? '',
        end_time: dateRange?.[1].format('YYYY-MM-DD HH:mm:ss') ?? '',
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        ...tableFilterInfo
      };

      createSortParams(params);

      return handleTableRequestError(
        sqlManage.GetSqlManageSqlPerformanceInsightsRelatedSQL(params)
      );
    },
    {
      refreshDeps: [
        instanceId,
        dateRange,
        pagination,
        tableFilterInfo,
        sortInfo
      ],
      ready: !!instanceId
    }
  );

  return (
    <RelatedSqlListStyleWrapper>
      <EmptyRowStyleWrapper>
        <Space>
          <span>{t('sqlInsights.relatedSqlList.title')}</span>
          {dateRange && dateRange[0] && dateRange[1] ? (
            <span>
              ({formatTime(dateRange[0], '-')} ~ {formatTime(dateRange[1], '-')}
              )
            </span>
          ) : (
            <span>
              ({t('sqlInsights.relatedSqlList.dateRangePlaceholder')})
            </span>
          )}
        </Space>
      </EmptyRowStyleWrapper>
      <TableToolbar
        refreshButton={{ refresh: refreshData, disabled: loading }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        rowKey="sql_fingerprint"
        dataSource={listData?.list}
        pagination={{
          total: listData?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        scroll={{ x: 'max-content' }}
        isPaginationFixed={false}
        actions={tableActions}
      />
    </RelatedSqlListStyleWrapper>
  );
};

export default RelatedSqlList;
