import { timeAddZero } from '@actiontech/shared/lib/utils/Common';
import { Tag } from 'antd';
import { t } from '../../../locale';
import { IListGlobalDBService } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import { IListGlobalDBServicesParams } from '@actiontech/shared/lib/api/base/service/DBService/index.d';
import { DatabaseTypeLogo } from '@actiontech/shared';

export type GLobalDataSourceListParamType = PageInfoWithoutIndexAndSize<
  IListGlobalDBServicesParams & { page_index: number }
>;

export const GlobalDataSourceColumns = (
  getLogoUrlByDbType: (dbType: string) => string
): ActiontechTableColumn<
  IListGlobalDBService,
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
      dataIndex: 'business',
      title: t('dmsGlobalDataSource.list.business')
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
      dataIndex: 'source',
      title: t('dmsGlobalDataSource.list.source')
    },
    {
      dataIndex: 'desc',
      title: t('dmsGlobalDataSource.list.describe'),
      className: 'ellipsis-column-width',
      render: (desc: string) => {
        return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
      }
    },
    {
      dataIndex: 'db_type',
      title: t('dmsGlobalDataSource.list.type'),
      filterCustomType: 'select',
      filterKey: 'filter_by_db_type',
      render: (dbType: string) => {
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
      render(value: IListGlobalDBService['maintenance_times']) {
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
      render: (value: IListGlobalDBService['is_enable_audit']) => {
        return value ? t('common.opened') : t('common.notOpen');
      }
    }
  ];
};
