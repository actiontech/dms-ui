import { ActionButton } from '@actiontech/shared';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { ReactNode } from 'react';
import { t } from '../../../locale';
import { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { InstanceAuditPlanResV1ActiveStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Typography } from 'antd';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const SqlManagementConfPageHeaderActions = (
  projectID: string
): Record<'add', ReactNode> => {
  return {
    add: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.CREATE}
      >
        <ActionButton
          type="primary"
          actionType="navigate-link"
          link={{
            to: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.create,
            params: { projectID }
          }}
          text={t('managementConf.list.pageAction.enableAuditPlan')}
        />
      </PermissionControl>
    )
  };
};

export const SqlManagementConfTableActions = ({
  editAction,
  deleteAction,
  disabledAction,
  enabledAction
}: {
  editAction: (id: string) => void;
  disabledAction: (id: string) => void;
  enabledAction: (id: string) => void;
  deleteAction: (id: string) => void;
}): ActiontechTableActionsWithPermissions<IInstanceAuditPlanResV1> => {
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
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.EDIT
      }
    ],
    moreButtons: [
      {
        key: 'disabled',
        text: t('managementConf.list.table.action.disabled.text'),
        confirm: (record) => {
          return {
            title: t('managementConf.list.table.action.disabled.confirmTips'),
            onConfirm: () => {
              disabledAction(record?.instance_audit_plan_id?.toString() ?? '');
            }
          };
        },
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.STOP,
        disabled: (record) =>
          record?.active_status !==
          InstanceAuditPlanResV1ActiveStatusEnum.normal
      },
      {
        key: 'enabled',
        text: t('managementConf.list.table.action.enabled.text'),
        onClick: (record) => {
          enabledAction(record?.instance_audit_plan_id?.toString() ?? '');
        },
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.ENABLE,
        disabled: (record) =>
          record?.active_status ===
          InstanceAuditPlanResV1ActiveStatusEnum.normal
      },
      {
        key: 'delete',
        text: (
          <Typography.Text type="danger">{t('common.delete')}</Typography.Text>
        ),
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.DELETE,
        confirm: (record) => {
          return {
            title: t('managementConf.list.table.action.delete.confirmTips'),
            onConfirm: () => {
              deleteAction(record?.instance_audit_plan_id?.toString() ?? '');
            }
          };
        }
      }
    ]
  };
};
