import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/global';
import { t } from '../../../../locale';
import { InstanceAuditPlanInfoActiveStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const SqlManagementConfDetailOverviewTableActions = ({
  enabledAction,
  disabledAction,
  deleteAction,
  disabledActionPending,
  enabledActionPending,
  deleteActionPending
}: {
  enabledAction: (auditPlanId: string) => void;
  disabledAction: (auditPlanId: string) => void;
  deleteAction: (auditPlanId: string) => void;
  disabledActionPending: boolean;
  enabledActionPending: boolean;
  deleteActionPending: boolean;
}): ActiontechTableActionsWithPermissions<IInstanceAuditPlanInfo> => {
  return {
    buttons: [
      {
        key: 'enable',
        text: t('managementConf.detail.overview.actions.enabled'),
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.DETAIL_ENABLE,
        buttonProps: (record) => {
          return {
            disabled:
              enabledActionPending ||
              record?.active_status !==
                InstanceAuditPlanInfoActiveStatusEnum.disabled,
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
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.DETAIL_STOP,
        buttonProps: (record) => {
          return {
            disabled:
              disabledActionPending ||
              record?.active_status !==
                InstanceAuditPlanInfoActiveStatusEnum.normal
          };
        },
        confirm: (record) => {
          return {
            disabled:
              disabledActionPending ||
              record?.active_status !==
                InstanceAuditPlanInfoActiveStatusEnum.normal,
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
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.DETAIL_DELETE,
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
