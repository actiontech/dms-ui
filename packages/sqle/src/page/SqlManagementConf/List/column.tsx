import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../locale';
import {
  BasicButton,
  BasicTag,
  BasicToolTips,
  DatabaseTypeLogo
} from '@actiontech/shared';
import { Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  IAuditPlanTypeResBase,
  IInstanceAuditPlanResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { InstanceAuditPlanTableFilterParamType } from './index.type';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { DashOutlined } from '@actiontech/icons';
import { InstanceAuditPlanResV1ActiveStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

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
      render: (instanceName: string, record) => {
        return (
          <Link to={`${record.instance_audit_plan_id}`}>
            {instanceName ||
              t('managementConf.list.table.column.staticScanType')}
          </Link>
        );
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
      title: () => t('managementConf.list.table.column.enabledScanTypes'),
      render: (scanTypes: IAuditPlanTypeResBase[]) => {
        if (scanTypes && scanTypes.length > 0) {
          if (scanTypes.length <= 2)
            return (
              <Space>
                {scanTypes.map((item) => (
                  <BasicTag key={item.type}>{item.desc}</BasicTag>
                ))}
              </Space>
            );

          return (
            <Space size={0}>
              {scanTypes.slice(0, 2).map((item) => (
                <BasicTag key={item.type}>{item.desc}</BasicTag>
              ))}
              <BasicToolTips
                trigger={'click'}
                title={
                  <Space wrap>
                    {scanTypes.map((item) => (
                      <BasicTag key={item.type}>{item.desc}</BasicTag>
                    ))}
                  </Space>
                }
              >
                <BasicButton
                  size="small"
                  className="table-row-scan-types-more-button"
                  icon={<DashOutlined />}
                />
              </BasicToolTips>
            </Space>
          );
        }
        return '-';
      }
    },
    {
      dataIndex: 'active_status',
      title: () => t('managementConf.list.table.column.dbTaskStatus'),
      render: (status: InstanceAuditPlanResV1ActiveStatusEnum) => {
        if (status === InstanceAuditPlanResV1ActiveStatusEnum.disabled) {
          return t('managementConf.list.table.column.taskStatus.disabled');
        }
        if (status === InstanceAuditPlanResV1ActiveStatusEnum.normal) {
          return t('managementConf.list.table.column.taskStatus.normal');
        }
        return t('common.unknownStatus');
      }
    },
    {
      dataIndex: 'create_time',
      title: () => t('managementConf.list.table.column.createdAt'),
      render: (time: string) => {
        return formatTime(time, '-');
      }
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
  username: string;
}) => ActiontechTableProps<IInstanceAuditPlanResV1>['actions'] = ({
  editAction,
  stopAction,
  deleteAction,
  isAdmin,
  isProjectManager,
  username
}) => {
  const hasPermission = (record?: IInstanceAuditPlanResV1) => {
    return isAdmin || isProjectManager || record?.creator === username;
  };
  return {
    buttons: [
      {
        text: t('common.edit'),
        key: 'edit-plan-task',
        buttonProps: (record) => {
          return {
            onClick: () => {
              editAction(record?.instance_audit_plan_id?.toString() ?? '');
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
              stopAction(record?.instance_audit_plan_id?.toString() ?? '');
            }
          };
        },
        permissions: (record) =>
          hasPermission(record) &&
          !!(
            record?.active_status ===
            InstanceAuditPlanResV1ActiveStatusEnum.normal
          )
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
              deleteAction(record?.instance_audit_plan_id?.toString() ?? '');
            }
          };
        },
        permissions: hasPermission
      }
    ]
  };
};
