import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../locale';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { InstanceAuditPlanTableFilterParamType } from './index.type';

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
  projectID: string,
  getLogoUrlByDbType: (dbType: string) => string
) => ActiontechTableColumn<
  IInstanceAuditPlanResV1,
  InstanceAuditPlanTableFilterParamType
> = (projectID, getLogoUrlByDbType) => {
  return [
    {
      dataIndex: 'instance_name',
      title: () => t('managementConf.list.table.column.dbName'),
      render: (dbName: string) => {
        return <Link to={`/project/${projectID}/db-services`}>{dbName}</Link>;
      }
    },
    {
      dataIndex: 'instance_type',
      title: () => t('managementConf.list.table.column.dbType'),
      render(type: string) {
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
      title: () => t('managementConf.list.table.column.enabledScanTypes')
    },
    {
      dataIndex: 'active_status',
      title: () => t('managementConf.list.table.column.dbTaskStatus')
    },
    // {
    //   dataIndex: 'active_status',
    //   title: () => t('managementConf.list.table.column.scanStatus')
    // },
    {
      dataIndex: 'create_time',
      title: () => t('managementConf.list.table.column.createdAt')
    },
    {
      dataIndex: 'creator',
      title: () => t('managementConf.list.table.column.creator')
    }
  ];
};

export const SqlManagementConfColumnAction: (params: {
  editAction: (id: string) => void;
  stopAction: (id: string) => void;
  deleteAction: (id: string) => void;
  isAdmin: boolean;
  isProjectManager: boolean;
  userID: string;
}) => ActiontechTableProps<IInstanceAuditPlanResV1>['actions'] = ({
  editAction,
  stopAction,
  deleteAction,
  isAdmin,
  isProjectManager,
  userID
}) => {
  const hasPermission = (record: any) => {
    return isAdmin || isProjectManager || record?.create_user_id === userID;
  };
  return {
    buttons: [
      {
        text: t('common.edit'),
        key: 'edit-plan-task',
        buttonProps: (record) => {
          return {
            onClick: () => {
              editAction(record?.instance_audit_plan_id ?? '');
            }
          };
        },
        permissions: hasPermission
      }
    ],
    moreButtons: [
      {
        key: 'inactive',
        text: t('managementConf.list.table.action.inactive.text'),
        confirm: (record) => {
          return {
            title: t('managementConf.list.table.action.inactive.confirmTips'),
            onConfirm: () => {
              stopAction(record?.instance_audit_plan_id ?? '');
            }
          };
        },
        permissions: hasPermission
      },
      {
        key: 'delete',
        text: (
          <Typography.Text type="danger">{t('common.delete')}</Typography.Text>
        ),
        confirm: (record) => {
          return {
            title: t('managementConf.list.table.action.delete.confirmTips'),
            onConfirm: () => {
              deleteAction(record?.instance_audit_plan_id ?? '');
            }
          };
        },
        permissions: hasPermission
      }
    ]
  };
};
