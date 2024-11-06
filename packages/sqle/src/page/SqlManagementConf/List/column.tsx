import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../locale';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { Link } from 'react-router-dom';
import { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { InstanceAuditPlanTableFilterParamType } from './index.type';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import {
  CheckCircleOutlined,
  CloseHexagonOutlined,
  InfoHexagonOutlined
} from '@actiontech/icons';
import { InstanceAuditPlanResV1ActiveStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import ScanTypeTagsCell from './ScanTypeTagsCell';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

export const ExtraFilterMeta: () => ActiontechTableFilterMeta<
  IInstanceAuditPlanResV1,
  InstanceAuditPlanTableFilterParamType
> = () => {
  return new Map<
    keyof IInstanceAuditPlanResV1,
    ActiontechTableFilterMetaValue<InstanceAuditPlanTableFilterParamType>
  >([
    [
      'active_status',
      {
        filterCustomType: 'select',
        filterKey: 'filter_by_active_status',
        filterLabel: t('managementConf.list.table.column.dbTaskStatus')
      }
    ]
  ]);
};

export const SqlManagementConfColumns: (
  getLogoUrlByDbType: (dbType: string) => string
) => ActiontechTableColumn<
  IInstanceAuditPlanResV1,
  InstanceAuditPlanTableFilterParamType
> = (getLogoUrlByDbType) => {
  return [
    {
      dataIndex: 'instance_name',
      title: () => t('managementConf.list.table.column.dbName'),
      render: (instanceName, record) => {
        return (
          <Link to={`${record.instance_audit_plan_id}`}>
            {instanceName ||
              t('managementConf.list.table.column.staticScanType')}
          </Link>
        );
      },
      filterCustomType: 'select',
      filterKey: 'filter_by_instance_id'
    },
    {
      dataIndex: 'instance_type',
      title: () => t('managementConf.list.table.column.dbType'),
      render(type) {
        if (!type) {
          return '-';
        }

        return (
          <DatabaseTypeLogo dbType={type} logoUrl={getLogoUrlByDbType(type)} />
        );
      }
    },
    {
      dataIndex: 'business',
      title: () => t('managementConf.list.table.column.business')
    },
    {
      dataIndex: 'audit_plan_types',
      title: () => t('managementConf.list.table.column.enabledScanTypes'),
      render: (scanTypes, record) => {
        return (
          <ScanTypeTagsCell
            instanceAuditPlanId={
              record.instance_audit_plan_id?.toString() ?? ''
            }
            scanTypes={scanTypes ?? []}
          />
        );
      }
    },
    {
      dataIndex: 'active_status',
      title: () => t('managementConf.list.table.column.dbTaskStatus'),
      render: (status) => {
        if (status === InstanceAuditPlanResV1ActiveStatusEnum.disabled) {
          return (
            <TableColumnWithIconStyleWrapper>
              <CloseHexagonOutlined />
              <span>
                {t('managementConf.list.table.column.taskStatus.disabled')}
              </span>
            </TableColumnWithIconStyleWrapper>
          );
        }
        if (status === InstanceAuditPlanResV1ActiveStatusEnum.normal) {
          return (
            <TableColumnWithIconStyleWrapper>
              <CheckCircleOutlined />
              <span>
                {t('managementConf.list.table.column.taskStatus.normal')}
              </span>
            </TableColumnWithIconStyleWrapper>
          );
        }
        return (
          <TableColumnWithIconStyleWrapper>
            <InfoHexagonOutlined />
            <span>{t('common.unknownStatus')}</span>
          </TableColumnWithIconStyleWrapper>
        );
      }
    },
    {
      dataIndex: 'create_time',
      title: () => t('managementConf.list.table.column.createdAt'),
      render: (time) => {
        return formatTime(time, '-');
      }
    },
    {
      dataIndex: 'creator',
      title: () => t('managementConf.list.table.column.creator')
    }
  ];
};
