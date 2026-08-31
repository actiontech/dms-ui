import {
  ActiontechTableColumn,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { BasicTag, BasicToolTips, TokenCom } from '@actiontech/shared';
import {
  InstanceAuditPlanInfoActiveStatusEnum,
  InstanceAuditPlanInfoAuditStatusEnum,
  InstanceAuditPlanInfoCollectionStatusEnum,
  InstanceAuditPlanInfoNextCollectionModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Link } from 'react-router-dom';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  CheckCircleOutlined,
  CloseHexagonOutlined,
  InfoHexagonOutlined
} from '@actiontech/icons';
import { Popover, Space, Typography } from 'antd';
import LastCollectResultCell from './LastCollectResultCell';
import LastAuditResultCell from './LastAuditResultCell';

const renderColumnHeaderTip = (title: string, tip: string) => (
  <BasicToolTips
    placement="topLeft"
    titleWidth={360}
    title={<span style={{ whiteSpace: 'pre-line' }}>{tip}</span>}
  >
    <span>{title}</span>
  </BasicToolTips>
);

type TaskStatusItem = {
  key: 'collection' | 'audit';
  color: 'blue' | 'green' | 'orange';
  text: string;
};

const isCollectingStatus = (record: IInstanceAuditPlanInfo) =>
  record.collection_status ===
  InstanceAuditPlanInfoCollectionStatusEnum.collecting;

const hasPendingAuditBacklog = (record: IInstanceAuditPlanInfo) =>
  (record.pending_audit_count ?? 0) > 0 ||
  record.audit_status === InstanceAuditPlanInfoAuditStatusEnum.pending_audit ||
  record.audit_status === 'pending';

/** 采集/审核双 Tag 与 Hover「当前状态」共用，避免展示漂移 */
const getTaskStatusItems = (
  record: IInstanceAuditPlanInfo
): TaskStatusItem[] => {
  const items: TaskStatusItem[] = [];
  const collecting = isCollectingStatus(record);

  if (collecting) {
    items.push({
      key: 'collection',
      color: 'blue',
      text: t(
        'managementConf.detail.overview.column.taskStatus.collection.collecting'
      )
    });
  } else if (
    record.collection_status ===
      InstanceAuditPlanInfoCollectionStatusEnum.idle &&
    !!record.last_collection_time
  ) {
    items.push({
      key: 'collection',
      color: 'green',
      text: t(
        'managementConf.detail.overview.column.taskStatus.collection.completed'
      )
    });
  }

  // 审核：auditing > 积压/采集中(待审核) > 已结束完成；采集中禁止「审核完成」
  if (record.audit_status === InstanceAuditPlanInfoAuditStatusEnum.auditing) {
    items.push({
      key: 'audit',
      color: 'blue',
      text: t('managementConf.detail.overview.column.taskStatus.audit.auditing')
    });
  } else if (hasPendingAuditBacklog(record) || collecting) {
    items.push({
      key: 'audit',
      color: 'orange',
      text: t(
        'managementConf.detail.overview.column.taskStatus.audit.pendingAudit'
      )
    });
  } else if (
    record.audit_status === InstanceAuditPlanInfoAuditStatusEnum.idle &&
    !!record.last_audit_finished_at
  ) {
    items.push({
      key: 'audit',
      color: 'green',
      text: t(
        'managementConf.detail.overview.column.taskStatus.audit.completed'
      )
    });
  }

  return items;
};

const renderTaskStatus = (record: IInstanceAuditPlanInfo) => {
  const statusItems = getTaskStatusItems(record);
  const currentStatus =
    statusItems.length > 0
      ? statusItems
          .map(({ text }) => text)
          .join(
            t(
              'managementConf.detail.overview.column.taskStatus.statusSeparator'
            )
          )
      : '--';

  return (
    <Popover
      content={
        <Space direction="vertical" size={4}>
          <span>
            {t(
              'managementConf.detail.overview.column.taskStatus.currentStatus',
              {
                value: currentStatus
              }
            )}
          </span>
          <span>
            {t(
              'managementConf.detail.overview.column.taskStatus.executionNode',
              {
                value: record.execution_node_address ?? '--'
              }
            )}
          </span>
          <span>
            {t('managementConf.detail.overview.column.taskStatus.updatedAt', {
              value: formatTime(record.last_task_updated_at ?? undefined, '--')
            })}
          </span>
        </Space>
      }
    >
      <Space
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {statusItems.length > 0
          ? statusItems.map(({ key, color, text }) => (
              <BasicTag key={key} color={color}>
                {text}
              </BasicTag>
            ))
          : '--'}
      </Space>
    </Popover>
  );
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

  // 旧后端未带 mode：按 active_status / collection_status 兜底
  if (record.active_status === InstanceAuditPlanInfoActiveStatusEnum.disabled) {
    return t('managementConf.detail.overview.column.nextCollectionTime.none');
  }
  if (
    record.collection_status ===
    InstanceAuditPlanInfoCollectionStatusEnum.collecting
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
      title: () =>
        renderColumnHeaderTip(
          t('managementConf.detail.overview.column.status'),
          t('managementConf.detail.overview.column.statusHeaderTips')
        ),
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
      dataIndex: 'collection_status',
      title: () =>
        renderColumnHeaderTip(
          t('managementConf.detail.overview.column.taskStatus.title'),
          t('managementConf.detail.overview.column.taskStatus.headerTips')
        ),
      render: (_status, record) => renderTaskStatus(record)
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
      dataIndex: 'last_collect_status',
      title: () =>
        t('managementConf.detail.overview.column.lastCollectResult.title'),
      render: (_status, record) => <LastCollectResultCell record={record} />
    },
    {
      dataIndex: 'last_audit_status',
      title: () =>
        t('managementConf.detail.overview.column.lastAuditResult.title'),
      render: (_status, record) => <LastAuditResultCell record={record} />
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
    width: 220,
    buttons: [
      {
        key: 'triggerCollect',
        text: t('managementConf.detail.overview.actions.triggerCollect'),
        permissions: () => hasOpPermission,
        buttonProps: (record) => {
          const isDisabled =
            record?.active_status ===
            InstanceAuditPlanInfoActiveStatusEnum.disabled;
          const cannotTrigger =
            isDisabled ||
            record?.can_trigger_collect !== true ||
            triggerCollectActionPending;

          let title: string | undefined;
          if (isDisabled) {
            title = t(
              'managementConf.detail.overview.actions.triggerCollectDisabledTips'
            );
          } else if (record?.can_trigger_collect !== true) {
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
