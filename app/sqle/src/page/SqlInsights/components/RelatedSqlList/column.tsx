import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetSqlPerformanceInsightsRelatedSQLParams } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.d';
import { RelatedSQLInfoSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../locale';
import SqlFingerprintColumn from './SqlFingerprintColumn';

export type RelatedSqlListFilterParams = Pick<
  IGetSqlPerformanceInsightsRelatedSQLParams,
  'filter_source'
>;

export const relatedSqlListColumn = (): ActiontechTableColumn<
  IRelatedSQLInfo,
  RelatedSqlListFilterParams
> => {
  return [
    {
      dataIndex: 'sql_fingerprint',
      title: () => t('sqlInsights.relatedSqlList.column.sqlFingerprint'),
      className: 'ellipsis-column-width',
      render: (value, record) => {
        return value ? (
          <SqlFingerprintColumn sqlFingerprint={value} record={record} />
        ) : (
          '-'
        );
      }
    },
    {
      dataIndex: 'source',
      title: () => t('sqlInsights.relatedSqlList.column.source'),
      render: (value?: RelatedSQLInfoSourceEnum) => {
        if (value === RelatedSQLInfoSourceEnum.workflow) {
          return t('sqlInsights.relatedSqlList.source.order');
        } else if (value === RelatedSQLInfoSourceEnum.sql_manage) {
          return t('sqlInsights.relatedSqlList.source.sqlManage');
        } else {
          return '-';
        }
      },
      filterKey: 'filter_source',
      filterCustomType: 'select'
    },
    {
      dataIndex: 'execute_time_avg',
      title: () => t('sqlInsights.relatedSqlList.column.executeStartAvg'),
      render: (value) => {
        return value ? `${value} s` : '-';
      },
      sorter: true
    },
    {
      dataIndex: 'execute_time_max',
      title: () => t('sqlInsights.relatedSqlList.column.maxExecuteTime'),
      render: (value) => {
        return value ? `${value} s` : '-';
      }
    },
    {
      dataIndex: 'execute_time_min',
      title: () => t('sqlInsights.relatedSqlList.column.minExecuteTime'),
      render: (value) => {
        return value ? `${value} s` : '-';
      }
    },
    {
      dataIndex: 'execute_time_sum',
      title: () => t('sqlInsights.relatedSqlList.column.sumExecuteTime'),
      render: (value) => {
        return value ? `${value} s` : '-';
      }
    },
    {
      dataIndex: 'lock_wait_time',
      title: () => t('sqlInsights.relatedSqlList.column.lockWaitTime'),
      render: (value) => {
        return value ? `${value} s` : '-';
      }
    }
  ];
};
