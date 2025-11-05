import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../../../../../locale';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';

type Params = {
  enableSqlRetryExecute: boolean;
  onRetryExecute: (record: IAuditTaskSQLResV2) => void;
};

export const SQLStatementResultActions = (
  params: Params
): ActiontechTableActionsWithPermissions<IAuditTaskSQLResV2> => {
  return {
    width: 100,
    buttons: [
      {
        key: 'retryExecute',
        text: t('execWorkflow.detail.overview.table.retryExecute'),
        buttonProps(record) {
          return {
            disabled: !params.enableSqlRetryExecute,
            hidden: ![
              getAuditTaskSQLsV2FilterExecStatusEnum.failed,
              getAuditTaskSQLsV2FilterExecStatusEnum.initialized
            ].includes(
              record?.exec_status as getAuditTaskSQLsV2FilterExecStatusEnum
            ),
            onClick: () => params.onRetryExecute(record!)
          };
        },
        permissions: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.EXEC_TASK
      }
    ]
  };
};
