import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  ISqlDEVRecord,
  IOptimizationRecord
} from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetOptimizationRecordsParams } from '@actiontech/shared/lib/api/sqle/service/sql_optimization/index.d';
import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { CustomAvatar, DatabaseTypeLogo } from '@actiontech/shared';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import OptimizationStatus from '../components/OptimizationStatus';
import { SqlOptimizationStatusEnum } from '../index.data';

export type SqlOptimizationListTableFilterParamType =
  PageInfoWithoutIndexAndSize<IGetOptimizationRecordsParams, 'project_name'>;

export const SqlOptimizationListColumns: (
  getLogoUrlByDbType: (dbType: string) => string
) => ActiontechTableColumn<
  IOptimizationRecord,
  SqlOptimizationListTableFilterParamType
> = (getLogoUrlByDbType) => {
  return [
    {
      dataIndex: 'optimization_id',
      title: () => t('sqlOptimization.table.optimizationId')
    },
    {
      dataIndex: 'optimization_name',
      title: () => t('sqlOptimization.table.optimizationName')
    },
    {
      dataIndex: 'instance_name',
      title: () => t('sqlOptimization.table.instanceName'),
      filterCustomType: 'select',
      filterKey: 'filter_instance_name'
    },
    {
      dataIndex: 'db_type',
      title: () => t('sqlOptimization.table.dbType'),
      render: (dbType) => {
        if (!dbType) return '-';

        return (
          <DatabaseTypeLogo
            dbType={dbType}
            logoUrl={getLogoUrlByDbType(dbType)}
          />
        );
      }
    },
    {
      dataIndex: 'performance_gain',
      title: () => t('sqlOptimization.table.performanceGain'),
      render: (performance) => {
        if (!performance) {
          return '-';
        }
        return isNaN(performance) ? '-' : `${floatToPercent(performance)}%`;
      }
    },
    {
      dataIndex: 'created_time',
      title: () => t('sqlOptimization.table.createTime'),
      render: (value) => {
        return formatTime(value, '-');
      }
    },
    {
      dataIndex: 'status',
      title: () => t('sqlOptimization.table.status'),
      render: (status) => {
        if (!status) {
          return '-';
        }
        return (
          <OptimizationStatus status={status as SqlOptimizationStatusEnum} />
        );
      }
    },
    {
      dataIndex: 'created_user',
      title: () => t('sqlOptimization.table.creator'),
      render: (creator: ISqlDEVRecord['creator']) => {
        return creator ? <CustomAvatar name={creator} /> : '-';
      }
    }
  ];
};
