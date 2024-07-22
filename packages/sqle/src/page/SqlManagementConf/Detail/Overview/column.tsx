import {
  ActiontechTableColumn,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import {
  IAuditPlanTypeResBase,
  IInstanceAuditPlanInfo
} from '@actiontech/shared/lib/api/sqle/service/common';
import { TokenCom } from '@actiontech/shared';
import { InstanceAuditPlanInfoActiveStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const ConfDetailOverviewColumns: () => ActiontechTableColumn<IInstanceAuditPlanInfo> =
  () => {
    return [
      {
        dataIndex: 'audit_plan_type',
        title: () => t('managementConf.detail.overview.column.auditPlanType'),
        filterCustomType: 'select',
        filterKey: 'filter_audit_plan_type',
        render: (data: IAuditPlanTypeResBase) => {
          return data.desc ?? '-';
        }
      },
      {
        dataIndex: 'audit_plan_rule_template_name',
        title: () =>
          t('managementConf.detail.overview.column.auditRuleTemplate')
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
        title: () =>
          t('managementConf.detail.overview.column.collectedSqlCount')
      },
      // #if [ee]
      {
        dataIndex: 'unsolved_sql_nums',
        title: () =>
          t('managementConf.detail.overview.column.problematicSqlCount')
      },
      // #endif
      {
        dataIndex: 'last_collection_time',
        title: () =>
          t('managementConf.detail.overview.column.lastCollectionTime'),
        render: (time: string) => formatTime(time, '-')
      }
    ];
  };

export const ConfDetailOverviewColumnActions: (
  enabledAction: () => void,
  disabledAction: (id: string, auditPlanType: string) => Promise<void>,
  disabledActionPending: boolean
) => ActiontechTableProps<IInstanceAuditPlanInfo>['actions'] = (
  enabledAction,
  disabledAction,
  disabledActionPending
) => {
  return {
    buttons: [
      {
        key: 'enable',
        text: t('managementConf.detail.overview.actions.enabled'),
        permissions: (record) =>
          record?.active_status ===
          InstanceAuditPlanInfoActiveStatusEnum.disabled,
        buttonProps: () => {
          return {
            onClick: enabledAction
          };
        }
      },
      {
        key: 'disable',
        text: t('managementConf.detail.overview.actions.disabled'),
        permissions: (record) =>
          record?.active_status ===
          InstanceAuditPlanInfoActiveStatusEnum.normal,
        confirm: (record) => {
          return {
            disabled: disabledActionPending,
            title: t(
              'managementConf.detail.overview.actions.disabledConfirmTips'
            ),
            onConfirm: () => {
              disabledAction(
                record?.id?.toString() ?? '',
                record?.audit_plan_type?.type ?? ''
              );
            }
          };
        }
      }
    ]
  };
};
