import { timeAddZero } from '@actiontech/shared/lib/utils/Common';
import { Tag } from 'antd';
import { t } from '../../../../locale';
import {
  IAuditPlanTypes,
  IListDBService
} from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import { IListDBServicesParams } from '@actiontech/shared/lib/api/base/service/DBService/index.d';
import { DatabaseTypeLogo } from '@actiontech/shared';
import ScanTypeTagsCell from 'sqle/src/page/SqlManagementConf/List/ScanTypeTagsCell';
import {
  ActiontechTableActionsWithConstantPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/global';

/*
 *PS：
 * 没有使用PageInfoWithoutIndexAndSize<IListDBServicesParams>的原因：
 * IAuthListDataOperationSetsParams里的page_index 是可选项，和TablePagination类型不匹配，期望后续后端可以修改。
 */
export type DataSourceListParamType = Omit<
  IListDBServicesParams,
  'page_index' | 'page_size' | 'project_uid'
>;

export const DataSourceColumns = (
  getLogoUrlByDbType: (dbType: string) => string
): ActiontechTableColumn<
  IListDBService,
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
      dataIndex: 'source',
      title: () => t('dmsDataSource.databaseList.source')
    },
    {
      dataIndex: 'desc',
      title: () => t('dmsDataSource.databaseList.describe'),
      className: 'ellipsis-column-width',
      render: (desc: string) => {
        return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
      }
    },
    {
      dataIndex: 'db_type',
      title: () => t('dmsDataSource.databaseList.type'),
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
    // #if [sqle]
    {
      dataIndex: 'audit_plan_types',
      title: () => t('dmsDataSource.databaseList.enabledScanTypes'),
      render: (scanTypes: IAuditPlanTypes[], record) => {
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
      dataIndex: 'business',
      title: () => t('dmsDataSource.databaseList.business')
    },

    // #if [dms]
    {
      dataIndex: 'is_enable_masking',
      title: () => t('dmsDataSource.databaseList.dataMask'),
      filterCustomType: 'select',
      filterKey: 'is_enable_masking',
      render: (value: boolean) => {
        return value ? t('common.enabled') : t('common.notEnabled');
      }
    },
    // #endif
    {
      dataIndex: 'maintenance_times',
      title: () => t('dmsDataSource.databaseList.maintenanceTime'),
      render(value: IListDBService['maintenance_times']) {
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

export const DataSourceListActions = (
  onNavigateUpdateDataSource: (uid: string) => void,
  onDeleteDataSource: (uid: string, name: string) => void,
  onTestConnection: (uid: string, name: string) => void,
  navigateToSqlManagementConf: (
    name: string,
    business: string,
    instanceAuditPlanId?: string
  ) => void
): ActiontechTableActionsWithConstantPermissions<IListDBService> => {
  return {
    buttons: [
      {
        key: 'edit-db-service',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: onNavigateUpdateDataSource.bind(null, record?.uid ?? '')
        }),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.EDIT
      },
      {
        key: 'delete-db-service',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('dmsDataSource.deleteDatabase.confirmMessage', {
            name: record?.name
          }),
          onConfirm: onDeleteDataSource.bind(
            null,
            record?.uid ?? '',
            record?.name ?? ''
          )
        }),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.DELETE
      },
      {
        key: 'test-db-service-connection',
        text: t('common.testDatabaseConnectButton.testDatabaseConnection'),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.TEST,
        buttonProps: (record) => ({
          onClick: onTestConnection.bind(
            null,
            record?.uid ?? '',
            record?.name ?? ''
          )
        })
      }
    ],
    moreButtons: [
      {
        key: 'test-db-service-connection',
        text: t('common.testDatabaseConnectButton.testDatabaseConnection'),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.TEST_IN_MORE_BUTTON,
        onClick: (record) =>
          onTestConnection(record?.uid ?? '', record?.name ?? '')
      },
      // #if [ee]
      {
        key: 'create-audit-plan',
        text: t('dmsDataSource.enabledAuditPlan.text'),
        permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.CREATE_AUDIT_PLAN,
        onClick: (record) => {
          navigateToSqlManagementConf(
            record?.uid ?? '',
            record?.business ?? '',
            record?.instance_audit_plan_id?.toString()
          );
        }
      }
      // #endif
    ]
  };
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
