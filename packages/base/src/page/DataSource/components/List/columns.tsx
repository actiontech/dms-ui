import { timeAddZero } from '@actiontech/dms-kit';
import { Tag } from 'antd';
import { t } from '../../../../locale';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { IListDBServicesV2Params } from '@actiontech/shared/lib/api/base/service/DBService/index.d';
import { DatabaseTypeLogo } from '@actiontech/dms-kit';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import ScanTypeTagsCell from 'sqle/src/page/SqlManagementConf/List/ScanTypeTagsCell';
import ConnectionResultColumn from './ConnectionResultColumn';
import { ServiceEnvironmentTagStyleWrapper } from './style';

/*
 *PS：
 * 没有使用PageInfoWithoutIndexAndSize<IListDBServicesParams>的原因：
 * IAuthListDataOperationSetsParams里的page_index 是可选项，和TablePagination类型不匹配，期望后续后端可以修改。
 */
export type DataSourceListParamType = Omit<
  IListDBServicesV2Params,
  'page_index' | 'page_size' | 'project_uid'
>;
export const DataSourceColumns = (
  getLogoUrlByDbType: (dbType: string) => string
): ActiontechTableColumn<
  IListDBServiceV2,
  DataSourceListParamType,
  'address'
> => {
  return [
    {
      dataIndex: 'name',
      title: () => t('dmsDataSource.databaseList.instanceName'),
      filterCustomType: 'select',
      filterKey: 'filter_by_name'
    },
    {
      dataIndex: 'address',
      title: () => t('dmsDataSource.databaseList.address'),
      render(_, record) {
        if (!record.host || !record.port) {
          return '-';
        }
        return `${record.host}:${record.port}`;
      }
    },
    {
      dataIndex: 'last_connection_test_status',
      title: () => t('dmsDataSource.databaseList.lastTestConnectionStatus'),
      filterCustomType: 'select',
      filterKey: 'filter_last_connection_test_status',
      filterLabel: t(
        'dmsDataSource.databaseList.testConnectionStatusFilterLabel'
      ),
      render: (status, record) => {
        return (
          <ConnectionResultColumn
            connectionStatus={status}
            connectionErrorMessage={record.last_connection_test_error_message}
            connectionTestTime={record.last_connection_test_time}
          />
        );
      }
    },
    {
      dataIndex: 'source',
      title: () => t('dmsDataSource.databaseList.source')
    },
    {
      dataIndex: 'desc',
      title: () => t('dmsDataSource.databaseList.describe'),
      className: 'ellipsis-column-width',
      render: (desc) => {
        return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
      }
    },
    {
      dataIndex: 'db_type',
      title: () => t('dmsDataSource.databaseList.type'),
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
    // #if [sqle]
    {
      dataIndex: 'audit_plan_types',
      title: () => t('dmsDataSource.databaseList.enabledScanTypes'),
      render: (scanTypes, record) => {
        if (!scanTypes || scanTypes.length === 0) {
          return '-';
        }
        return (
          <ScanTypeTagsCell
            scanTypes={scanTypes}
            instanceAuditPlanId={
              record.instance_audit_plan_id?.toString() ?? ''
            }
          />
        );
      }
    },
    // #endif
    {
      dataIndex: 'environment_tag',
      title: () => t('dmsDataSource.databaseList.environmentAttribute'),
      render: (environment) => {
        if (!environment?.name) {
          return '-';
        }
        return (
          <ServiceEnvironmentTagStyleWrapper>
            {environment?.name}
          </ServiceEnvironmentTagStyleWrapper>
        );
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_environment_tag_uid'
    },
    // #if [dms]
    {
      dataIndex: 'is_enable_masking',
      title: () => t('dmsDataSource.databaseList.dataMask'),
      filterCustomType: 'select',
      filterKey: 'is_enable_masking',
      render: (value) => {
        return value ? t('common.enabled') : t('common.notEnabled');
      }
    },
    // #endif
    // #if [sqle&&ee]
    {
      dataIndex: 'enable_backup',
      title: () => t('dmsDataSource.databaseList.backup'),
      render: (value) => {
        return value ? t('common.enabled') : t('common.notEnabled');
      }
    },
    // #endif
    {
      dataIndex: 'maintenance_times',
      title: () => t('dmsDataSource.databaseList.maintenanceTime'),
      render(value) {
        if (!value || value.length === 0) {
          return '-';
        }
        return value?.map((time, i) => (
          <Tag key={i}>
            {timeAddZero(time.maintenance_start_time?.hour ?? 0)}:
            {timeAddZero(time.maintenance_start_time?.minute ?? 0)} -
            {timeAddZero(time.maintenance_stop_time?.hour ?? 0)}:
            {timeAddZero(time.maintenance_stop_time?.minute ?? 0)}
          </Tag>
        ));
      }
    }
  ];
};
export enum DataMaskingFilterTypeEnum {
  'checked' = 'checked',
  'unchecked' = 'unchecked'
}
export const filterDataMaskOptions = [
  {
    value: DataMaskingFilterTypeEnum.checked,
    label: t('common.enabled')
  },
  {
    value: DataMaskingFilterTypeEnum.unchecked,
    label: t('common.notEnabled')
  }
];
