import {
  ActiontechTableColumn,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../locale';

export const ConfDetailOverviewColumns: () => ActiontechTableColumn<any> =
  () => {
    return [
      {
        dataIndex: 'auditPlanType',
        title: () => t('managementConf.detail.overview.column.auditPlanType'),
        filterCustomType: 'select',
        filterKey: 'filter_audit_plan_type'
      },
      {
        dataIndex: 'auditRuleTemplate',
        title: () =>
          t('managementConf.detail.overview.column.auditRuleTemplate')
      },
      {
        dataIndex: 'scanType',
        title: () => t('managementConf.detail.overview.column.scanType')
      },
      {
        dataIndex: 'connectionInfo',
        title: () => t('managementConf.detail.overview.column.connectionInfo')
      },
      {
        dataIndex: 'collectedSqlCount',
        title: () =>
          t('managementConf.detail.overview.column.collectedSqlCount')
      },
      {
        dataIndex: 'problematicSqlCount',
        title: () =>
          t('managementConf.detail.overview.column.problematicSqlCount')
      },
      {
        dataIndex: 'lastCollectionTime',
        title: () =>
          t('managementConf.detail.overview.column.lastCollectionTime')
      }
    ];
  };

export const ConfDetailOverviewColumnActions: (
  enabledAction: () => void,
  disabledAction: () => void
) => ActiontechTableProps<any>['actions'] = (enabledAction, disabledAction) => {
  return {
    buttons: [
      {
        key: 'enable',
        text: t('managementConf.detail.overview.actions.enabled'),
        buttonProps: () => {
          return {
            onClick: enabledAction
          };
        }
      },
      {
        key: 'disable',
        text: t('managementConf.detail.overview.actions.disabled'),
        buttonProps: () => {
          return {
            onClick: disabledAction
          };
        }
      }
    ]
  };
};
