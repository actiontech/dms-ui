import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { t } from '../../../../locale';
import { InstanceAuditPlanInfoActiveStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Typography } from 'antd';

export const SqlManagementConfDetailOverviewTableActions = ({
  enabledAction,
  disabledAction,
  deleteAction,
  resetTokenAction,
  disabledActionPending,
  enabledActionPending,
  deleteActionPending,
  resetTokenActionPending
}: {
  enabledAction: (auditPlanId: string) => void;
  disabledAction: (auditPlanId: string) => void;
  deleteAction: (auditPlanId: string) => void;
  resetTokenAction: () => void;
  disabledActionPending: boolean;
  enabledActionPending: boolean;
  deleteActionPending: boolean;
  resetTokenActionPending: boolean;
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
      }
    ],
    moreButtons: (record) => {
      const deleteButton = {
        key: 'delete',
        text: (
          <Typography.Text type="danger">
            {t('managementConf.detail.overview.actions.delete')}
          </Typography.Text>
        ),
        buttonProps: () => {
          return {
            disabled: deleteActionPending
          };
        },
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.DETAIL_DELETE,
        confirm: () => {
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
      };

      if (!!record.exec_cmd) {
        return [
          {
            key: 'reset-token',
            text: t('managementConf.detail.overview.actions.resetToken'),
            permissions:
              PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.RESET_TOKEN,
            confirm: () => {
              return {
                disabled: resetTokenActionPending,
                title: t(
                  'managementConf.detail.overview.actions.resetTokenConfirmTitle'
                ),
                onConfirm: resetTokenAction
              };
            }
          },
          deleteButton
        ];
      }
      return [deleteButton];
    }
  };
};
