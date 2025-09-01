import { useTranslation } from 'react-i18next';
import { RelatedSqlListStyleWrapper } from './style';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableFilterContainer,
  useTableFilterContainer,
  FilterCustomProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { SqleApi } from '@actiontech/shared/lib/api/';
import { relatedSqlListColumn, RelatedSqlListFilterParams } from './column';
import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { EmptyRowStyleWrapper } from '@actiontech/dms-kit';
import { formatTime } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { useEffect, useMemo } from 'react';
import { GetSqlPerformanceInsightsRelatedSQLFilterSourceEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';
import { IGetSqlPerformanceInsightsRelatedSQLParams } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.d';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
// import { relatedSqlTableActions } from './actions';
// import { ModalName } from '../../../../data/ModalName';
// import {
//   updateSqlInsightsModalStatus,
//   updateRelateSqlSelectedRecord
// } from '../../../../store/sqlInsights';
import { RelatedSqlFilterSourceOptions } from './data';
import useRelatedSqlRedux from './useRelatedSqlRedux';
export interface RelatedSqlListProps {
  instanceId?: string;
}
const RelatedSqlList: React.FC<RelatedSqlListProps> = ({ instanceId }) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const { clearDateRange } = useRelatedSqlRedux();
  // const dispatch = useDispatch();
  const { startTime, endTime } = useSelector((state: IReduxState) => {
    const { selectedDateRange } = state.sqlInsights.relateSqlList;
    return {
      startTime: formatTime(selectedDateRange?.[0]),
      endTime: formatTime(selectedDateRange?.[1])
    };
  });
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

  // const onAnalyzeSql = useMemoizedFn((record: IRelatedSQLInfo) => {
  //   message.info('SQL分析功能将在此实现');
  //   // TODO: 跳转至SQL分析页面，但是现有的设计有两个问题。需要跟具体实现的后端/产品讨论。
  //   // 1、现有的SQL分析页面需要一个  sqlManageId 参数。但是当前table没有这个感念。
  //   // 2、现有的SQL分析针对的是具体的SQL，而当前的表针对的是sql指纹。
  // });

  // const onViewRelatedTransactions = useMemoizedFn((record: IRelatedSQLInfo) => {
  //   dispatch(
  //     updateSqlInsightsModalStatus({
  //       modalName:
  //         ModalName.Sql_Insights_Related_SQL_Item_Relate_Transaction_Drawer,
  //       status: true
  //     })
  //   );
  //   dispatch(
  //     updateRelateSqlSelectedRecord({
  //       record
  //     })
  //   );
  // });

  const columns = useMemo(() => {
    return relatedSqlListColumn();
  }, []);

  // todo 本期暂不处理此操作 暂时隐藏
  // const tableActions = useMemo(() => {
  //   return relatedSqlTableActions(onAnalyzeSql, onViewRelatedTransactions);
  // }, [onAnalyzeSql, onViewRelatedTransactions]);

  const { filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer<IRelatedSQLInfo, RelatedSqlListFilterParams>(
      columns,
      updateTableFilterInfo
    );
  const filterCustomProps = useMemo(() => {
    return new Map<keyof IRelatedSQLInfo, FilterCustomProps>([
      [
        'source',
        {
          options: RelatedSqlFilterSourceOptions,
          allowClear: false,
          defaultValue:
            GetSqlPerformanceInsightsRelatedSQLFilterSourceEnum.workflow
        }
      ]
    ]);
  }, []);
  const { data: listData, loading } = useRequest(
    () => {
      if (!startTime || !endTime) {
        return Promise.resolve<{
          list?: IRelatedSQLInfo[];
          total: number;
        }>({
          list: [],
          total: 0
        });
      }
      const params: IGetSqlPerformanceInsightsRelatedSQLParams = {
        project_name: projectName,
        instance_id: instanceId ?? '',
        start_time: startTime,
        end_time: endTime,
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        ...tableFilterInfo
      };
      createSortParams(params);
      return handleTableRequestError(
        SqleApi.SqlInsightService.GetSqlPerformanceInsightsRelatedSQL(params)
      );
    },
    {
      refreshDeps: [
        instanceId,
        startTime,
        endTime,
        pagination,
        tableFilterInfo,
        sortInfo
      ],
      ready: !!instanceId
    }
  );
  useEffect(() => {
    updateTableFilterInfo({
      filter_source:
        GetSqlPerformanceInsightsRelatedSQLFilterSourceEnum.workflow
    });
    updateAllSelectedFilterItem(true);
    return () => clearDateRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <RelatedSqlListStyleWrapper>
      <EmptyRowStyleWrapper>
        <Space>
          <span>{t('sqlInsights.relatedSqlList.title')}</span>
          {startTime && endTime ? (
            <span>
              ({formatTime(startTime, '-')} ~ {formatTime(endTime, '-')})
            </span>
          ) : (
            <span>
              ({t('sqlInsights.relatedSqlList.dateRangePlaceholder')})
            </span>
          )}
        </Space>
      </EmptyRowStyleWrapper>
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        dataSource={listData?.list}
        pagination={{
          total: listData?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        scroll={{
          x: 'max-content'
        }}
        isPaginationFixed={false}
        // actions={tableActions}
      />
    </RelatedSqlListStyleWrapper>
  );
};
export default RelatedSqlList;
