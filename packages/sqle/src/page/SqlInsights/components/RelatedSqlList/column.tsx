import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetSqlManageSqlPerformanceInsightsRelatedSQLParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { RelatedSQLInfoSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../locale';
import { Popover, Tooltip } from 'antd';
import SqlFingerprintColumn from './SqlFingerprintColumn';

export type RelatedSqlListFilterParams = Pick<
  IGetSqlManageSqlPerformanceInsightsRelatedSQLParams,
  'filter_source'
>;

export const RelatedSqlListColumn = (): ActiontechTableColumn<
  IRelatedSQLInfo,
  RelatedSqlListFilterParams
> => {
  return [
    {
      dataIndex: 'sql_fingerprint',
      title: () => t('sqlInsights.relatedSqlList.column.sqlFingerprint'),
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
        if (value === RelatedSQLInfoSourceEnum.order) {
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
      dataIndex: 'execute_start_time',
      title: () => t('sqlInsights.relatedSqlList.column.executeStartTime'),
      render: (value) => {
        return formatTime(value, '-');
      },
      sorter: true
    },
    {
      dataIndex: 'execute_end_time',
      title: () => t('sqlInsights.relatedSqlList.column.executeEndTime'),
      render: (value) => {
        return formatTime(value, '-');
      }
    },
    {
      dataIndex: 'execute_time',
      title: () => t('sqlInsights.relatedSqlList.column.executeTime'),
      render: (value) => {
        return value ? `${value} ms` : '-';
      }
    },
    {
      dataIndex: 'lock_wait_time',
      title: () => t('sqlInsights.relatedSqlList.column.lockWaitTime'),
      render: (value) => {
        return value ? `${value} ms` : '-';
      }
    }
  ];
};
