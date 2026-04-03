import { ActiontechTableActionsConfig } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IGlobalSqlManageTaskItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { GlobalSqlManageTaskItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  PERMISSIONS,
  PermissionsConstantType,
  type CheckActionPermissionOtherValues
} from '@actiontech/shared/lib/features';
import { t } from '../../../../locale';

export const sqlGovernancePanelTableActions = (
  onOptimize: (record: IGlobalSqlManageTaskItemV2) => void,
  onDetail: (record: IGlobalSqlManageTaskItemV2) => void,
  checkActionPermission: (
    permission: PermissionsConstantType,
    otherValues?: CheckActionPermissionOtherValues<IGlobalSqlManageTaskItemV2>
  ) => boolean
): ActiontechTableActionsConfig<IGlobalSqlManageTaskItemV2> => {
  return {
    width: 120,
    buttons: [
      {
        key: 'optimize',
        text: t('globalDashboard.sql.action.optimize'),
        buttonProps: (record) => ({
          onClick: (e) => {
            e.stopPropagation();
            if (record) {
              onOptimize(record);
            }
          }
        }),
        permissions: (record) =>
          record?.status === GlobalSqlManageTaskItemV2StatusEnum.unhandled &&
          checkActionPermission(
            PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.UPDATE_STATUS
          )
      },
      {
        key: 'detail',
        text: t('globalDashboard.sql.action.detail'),
        buttonProps: (record) => ({
          onClick: (e) => {
            e.stopPropagation();
            if (record) {
              onDetail(record);
            }
          }
        }),
        permissions: (record) => {
          if (record?.status === GlobalSqlManageTaskItemV2StatusEnum.solved) {
            return true;
          }
          return false;
        }
      }
    ]
  };
};
