import {
  ActiontechTableColumn,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { TokenCom } from '@actiontech/shared';
import {
  InstanceAuditPlanInfoActiveStatusEnum,
  InstanceAuditPlanInfoNextCollectionModeEnum,
  InstanceAuditPlanInfoPipelineStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Link } from 'react-router-dom';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  CheckCircleOutlined,
  CloseHexagonOutlined,
  InfoHexagonOutlined
} from '@actiontech/icons';
import { Typography } from 'antd';
import LastCollectResultCell from './LastCollectResultCell';

const renderPipelineStatus = (status?: string) => {
  switch (status) {
    case InstanceAuditPlanInfoPipelineStatusEnum.collecting:
      return t(
        'managementConf.detail.overview.column.pipelineStatus.collecting'
      );
    case InstanceAuditPlanInfoPipelineStatusEnum.pending_audit:
      return t(
        'managementConf.detail.overview.column.pipelineStatus.pendingAudit'
      );
    case InstanceAuditPlanInfoPipelineStatusEnum.auditing:
      return t('managementConf.detail.overview.column.pipelineStatus.auditing');
    case InstanceAuditPlanInfoPipelineStatusEnum.idle:
    case undefined:
    case '':
      return t('managementConf.detail.overview.column.pipelineStatus.idle');
    default:
      return t('managementConf.detail.overview.column.pipelineStatus.idle');
  }
};

const renderNextCollectionTime = (record: IInstanceAuditPlanInfo) => {
  const mode = record.next_collection_mode;
  if (mode === InstanceAuditPlanInfoNextCollectionModeEnum.none) {
    return t('managementConf.detail.overview.column.nextCollectionTime.none');
  }
  if (mode === InstanceAuditPlanInfoNextCollectionModeEnum.after_collect) {
    return t(
      'managementConf.detail.overview.column.nextCollectionTime.afterCollect'
    );
  }
  if (mode === InstanceAuditPlanInfoNextCollectionModeEnum.schedule) {
    return formatTime(
      record.next_collection_time,
      t('managementConf.detail.overview.column.nextCollectionTime.none')
    );
  }

  // 旧后端未带 mode：按 active_status / pipeline_status 兜底
  if (record.active_status === InstanceAuditPlanInfoActiveStatusEnum.disabled) {
    return t('managementConf.detail.overview.column.nextCollectionTime.none');
  }
  if (
    record.pipeline_status ===
    InstanceAuditPlanInfoPipelineStatusEnum.collecting
  ) {
    return t(
      'managementConf.detail.overview.column.nextCollectionTime.afterCollect'
    );
  }
  return formatTime(
    record.next_collection_time,
    t('managementConf.detail.overview.column.nextCollectionTime.none')
  );
};

export const ConfDetailOverviewColumns: (
  projectID: string
) => ActiontechTableColumn<IInstanceAuditPlanInfo> = (projectID) => {
  return [
    {
      dataIndex: 'audit_plan_type',
      title: () => t('managementConf.detail.overview.column.auditPlanType'),
      filterCustomType: 'select',
      filterKey: 'filter_audit_plan_type',
      render: (data) => {
        return data?.desc ? (
          <Typography.Link>{data.desc}</Typography.Link>
        ) : (
          '-'
        );
      }
    },
    {
      dataIndex: 'audit_plan_rule_template',
      title: () => t('managementConf.detail.overview.column.auditRuleTemplate'),
      render: (ruleTemplate, record) => {
        if (!ruleTemplate?.name) {
          return '-';
        }
        const path = ruleTemplate?.is_global_rule_template
          ? `/sqle/rule-manager/global-detail/${ruleTemplate.name}/${record.audit_plan_db_type}`
          : `/sqle/project/${projectID}/rule/template/detail/${ruleTemplate.name}/${record.audit_plan_db_type}`;

        return (
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            target="_blank"
            to={path}
          >
            {ruleTemplate.name}
          </Link>
        );
      }
    },
    {
      dataIndex: 'active_status',
      title: () => t('managementConf.detail.overview.column.status'),
      render: (status) => {
        if (status === InstanceAuditPlanInfoActiveStatusEnum.disabled) {
          return (
            <TableColumnWithIconStyleWrapper>
              <CloseHexagonOutlined />
              <span>
                {t(
                  'managementConf.detail.overview.column.enableStatus.disabled'
                )}
              </span>
            </TableColumnWithIconStyleWrapper>
          );
        }
        if (status === InstanceAuditPlanInfoActiveStatusEnum.normal) {
          return (
            <TableColumnWithIconStyleWrapper>
              <CheckCircleOutlined />
              <span>
                {t('managementConf.detail.overview.column.enableStatus.normal')}
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
      dataIndex: 'pipeline_status',
      title: () =>
        t('managementConf.detail.overview.column.pipelineStatus.title'),
      render: (status) => renderPipelineStatus(status)
    },
    {
      dataIndex: 'next_collection_time',
      title: () =>
        t('managementConf.detail.overview.column.nextCollectionTime.title'),
      render: (_time, record) => renderNextCollectionTime(record)
    },
    {
      dataIndex: 'exec_cmd',
      title: () => t('managementConf.detail.overview.column.connectionInfo'),
      render: (text) => {
        if (!text) return '-';
        return <TokenCom text={text} />;
      }
    },
    {
      dataIndex: 'total_sql_nums',
      title: () => t('managementConf.detail.overview.column.collectedSqlCount')
    },
    // #if [ee]
    {
      dataIndex: 'unsolved_sql_nums',
      title: () =>
        t('managementConf.detail.overview.column.problematicSqlCount')
    },
    // #endif
    {
      dataIndex: 'last_collect_status',
      title: () =>
        t('managementConf.detail.overview.column.lastCollectResult.title'),
      render: (_status, record) => <LastCollectResultCell record={record} />
    },
    {
      dataIndex: 'last_collection_time',
      title: () =>
        t('managementConf.detail.overview.column.lastCollectionTime'),
      render: (time) => formatTime(time, '-')
    }
  ];
};

export const ConfDetailOverviewColumnActions: (params: {
  enabledAction: (auditPlanId: string) => void;
  disabledAction: (auditPlanId: string) => void;
  deleteAction: (auditPlanId: string) => void;
  triggerCollectAction: (auditPlanId: string) => void;
  disabledActionPending: boolean;
  enabledActionPending: boolean;
  deleteActionPending: boolean;
  triggerCollectActionPending: boolean;
  hasOpPermission: boolean;
}) => ActiontechTableProps<IInstanceAuditPlanInfo>['actions'] = ({
  enabledAction,
  disabledAction,
  deleteAction,
  triggerCollectAction,
  disabledActionPending,
  enabledActionPending,
  deleteActionPending,
  triggerCollectActionPending,
  hasOpPermission
}) => {
  return {
    width: 360,
    buttons: [
      {
        key: 'triggerCollect',
        text: t('managementConf.detail.overview.actions.triggerCollect'),
        permissions: () => hasOpPermission,
        buttonProps: (record) => {
          const isDisabled =
            record?.active_status ===
            InstanceAuditPlanInfoActiveStatusEnum.disabled;
          const isCollecting =
            record?.pipeline_status ===
            InstanceAuditPlanInfoPipelineStatusEnum.collecting;
          const cannotTrigger =
            isDisabled || isCollecting || triggerCollectActionPending;

          let title: string | undefined;
          if (isDisabled) {
            title = t(
              'managementConf.detail.overview.actions.triggerCollectDisabledTips'
            );
          } else if (isCollecting) {
            title = t(
              'managementConf.detail.overview.actions.triggerCollectCollectingTips'
            );
          }

          return {
            disabled: cannotTrigger,
            title,
            onClick: () => {
              if (cannotTrigger) return;
              triggerCollectAction(
                record?.audit_plan_type?.audit_plan_id?.toString() ?? ''
              );
            }
          };
        }
      },
      {
        key: 'enable',
        text: t('managementConf.detail.overview.actions.enabled'),
        permissions: (record) =>
          record?.active_status ===
            InstanceAuditPlanInfoActiveStatusEnum.disabled && hasOpPermission,
        buttonProps: (record) => {
          return {
            disabled: enabledActionPending,
            onClick: () => {
              enabledAction(
                record?.audit_plan_type?.audit_plan_id?.toString() ?? ''
              );
            }
          };
        }
      },
      {
        key: 'disable',
        text: t('managementConf.detail.overview.actions.disabled'),
        permissions: (record) =>
          record?.active_status ===
            InstanceAuditPlanInfoActiveStatusEnum.normal && hasOpPermission,
        buttonProps: () => {
          return {
            disabled: disabledActionPending
          };
        },
        confirm: (record) => {
          return {
            disabled: disabledActionPending,
            title: t(
              'managementConf.detail.overview.actions.disabledConfirmTips'
            ),
            onConfirm: () => {
              disabledAction(
                record?.audit_plan_type?.audit_plan_id?.toString() ?? ''
              );
            }
          };
        }
      },
      {
        key: 'delete',
        text: t('managementConf.detail.overview.actions.delete'),
        buttonProps: () => {
          return {
            disabled: deleteActionPending,
            danger: true
          };
        },
        permissions: () => hasOpPermission,
        confirm: (record) => {
          return {
            disabled: deleteActionPending,
            title: t(
              'managementConf.detail.overview.actions.deleteConfirmTips'
            ),
            onConfirm: () => {
              deleteAction(
                record?.audit_plan_type?.audit_plan_id?.toString() ?? ''
              );
            }
          };
        }
      }
    ]
  };
};
