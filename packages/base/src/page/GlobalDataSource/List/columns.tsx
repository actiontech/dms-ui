import { timeAddZero } from '@actiontech/shared/lib/utils/Common';
import { Tag } from 'antd';
import { t } from '../../../locale';
import { IListGlobalDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListGlobalDBServicesV2Params } from '@actiontech/shared/lib/api/base/service/DBService/index.d';
import {
  BasicTypographyEllipsis,
  DatabaseTypeLogo,
  BasicTag
} from '@actiontech/shared';
import ConnectionResultColumn from '../../DataSource/components/List/ConnectionResultColumn';
import { ListDBServiceV2LastConnectionTestStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export type GLobalDataSourceListParamType = PageInfoWithoutIndexAndSize<
  IListGlobalDBServicesV2Params & { page_index: number }
>;

export const GlobalDataSourceColumns = (
  getLogoUrlByDbType: (dbType: string) => string
): ActiontechTableColumn<
  IListGlobalDBServiceV2,
  GLobalDataSourceListParamType,
  'address'
> => {
  return [
    {
      dataIndex: 'name',
      title: t('dmsGlobalDataSource.list.instanceName')
    },
    {
      dataIndex: 'project_name',
      title: t('dmsGlobalDataSource.list.projectName'),
      filterCustomType: 'select',
      filterKey: 'filter_by_project_uid'
    },
    {
      dataIndex: 'environment_tag',
      title: t('dmsGlobalDataSource.list.environmentAttribute'),
      render: (environment) => {
        if (!environment?.name) {
          return '-';
        }
        return <BasicTag>{environment?.name}</BasicTag>;
      }
    },
    {
      dataIndex: 'address',
      title: t('dmsGlobalDataSource.list.address'),
      render(_, record) {
        if (!record.host || !record.port) {
          return '-';
        }
        return `${record.host}:${record.port}`;
      }
    },
    {
      dataIndex: 'last_connection_test_status',
      title: () => t('dmsGlobalDataSource.list.lastTestConnectionStatus'),
      filterCustomType: 'select',
      filterKey: 'filter_last_connection_test_status',
      filterLabel: t(
        'dmsGlobalDataSource.list.testConnectionStatusFilterLabel'
      ),
      render: (status, record) => {
        return (
          <ConnectionResultColumn
            connectionStatus={
              status as ListDBServiceV2LastConnectionTestStatusEnum | undefined
            }
            connectionErrorMessage={record.last_connection_test_error_message}
            connectionTestTime={record.last_connection_test_time}
          />
        );
      }
    },
    {
      dataIndex: 'source',
      title: t('dmsGlobalDataSource.list.source')
    },
    {
      dataIndex: 'desc',
      title: t('dmsGlobalDataSource.list.describe'),
      className: 'ellipsis-column-width',
      render: (desc) => {
        return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
      }
    },
    {
      dataIndex: 'db_type',
      title: t('dmsGlobalDataSource.list.type'),
      filterCustomType: 'select',
      filterKey: 'filter_by_db_type',
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
      dataIndex: 'maintenance_times',
      title: t('dmsGlobalDataSource.list.maintenanceTime'),
      render(value: IListGlobalDBServiceV2['maintenance_times']) {
        return value?.map((time, i) => (
          <Tag key={i}>
            {timeAddZero(time.maintenance_start_time?.hour ?? 0)}:
            {timeAddZero(time.maintenance_start_time?.minute ?? 0)} -
            {timeAddZero(time.maintenance_stop_time?.hour ?? 0)}:
            {timeAddZero(time.maintenance_stop_time?.minute ?? 0)}
          </Tag>
        ));
      }
    },
    {
      dataIndex: 'unfinished_workflow_num',
      title: t('dmsGlobalDataSource.list.unfinishedWorkflowNum')
    },
    {
      dataIndex: 'is_enable_audit',
      title: t('dmsGlobalDataSource.list.workbenchQueryAudit'),
      render: (value: IListGlobalDBServiceV2['is_enable_audit']) => {
        return value ? t('common.opened') : t('common.notOpen');
      }
    }
  ];
};
