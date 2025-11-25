import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IOptimizationRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetOptimizationRecordsV2Params } from '@actiontech/shared/lib/api/sqle/service/sql_optimization/index.d';
import { t } from '../../../locale';
import { AvatarCom, DatabaseTypeLogo, BasicToolTips } from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import OptimizationStatus from '../components/OptimizationStatus';
import { OptimizationRecordStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type SqlOptimizationListTableFilterParamType =
  PageInfoWithoutIndexAndSize<IGetOptimizationRecordsV2Params, 'project_name'>;

export const sqlOptimizationListColumns: (
  getLogoUrlByDbType: (dbType: string) => string
) => ActiontechTableColumn<
  IOptimizationRecord,
  SqlOptimizationListTableFilterParamType
> = (getLogoUrlByDbType) => {
  return [
    {
      dataIndex: 'optimization_id',
      title: () => t('sqlOptimization.table.optimizationId'),
      show: false
    },
    {
      dataIndex: 'optimization_name',
      title: () => t('sqlOptimization.table.optimizationName')
    },
    {
      dataIndex: 'instance_name',
      title: () => t('sqlOptimization.table.instanceName'),
      render: (instanceName) => {
        return instanceName || '-';
      },
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
      dataIndex: 'status',
      title: () => t('sqlOptimization.table.status'),
      render: (status, record) => {
        if (!status) {
          return '-';
        }

        const content = (
          <OptimizationStatus status={status as OptimizationRecordStatusEnum} />
        );

        if (status === OptimizationRecordStatusEnum.failed) {
          return (
            <BasicToolTips title={record.status_detail}>
              {content}
            </BasicToolTips>
          );
        }
        return content;
      }
    },
    {
      dataIndex: 'performance_improve',
      title: () => t('sqlOptimization.table.performanceGain'),
      render: (performance) => {
        if (!performance) {
          return '-';
        }
        return isNaN(performance) ? '-' : `${floatToPercent(performance)}%`;
      }
    },
    {
      dataIndex: 'number_of_rule',
      title: () => t('sqlOptimization.table.numberOfRule')
    },
    {
      dataIndex: 'number_of_index',
      title: () => t('sqlOptimization.table.numberOfIndexx')
    },
    {
      dataIndex: 'created_user',
      title: () => t('sqlOptimization.table.creator'),
      render: (creator) => {
        return creator ? <AvatarCom name={creator} /> : '-';
      }
    },
    {
      dataIndex: 'created_time',
      title: () => t('sqlOptimization.table.createTime'),
      render: (value) => {
        return formatTime(value, '-');
      }
    }
  ];
};
