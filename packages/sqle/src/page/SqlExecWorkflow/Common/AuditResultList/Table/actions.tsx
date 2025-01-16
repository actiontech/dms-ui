import { RobotOutlined } from '@actiontech/icons';
import { t } from '../../../../../locale';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/features';

export const AuditResultForCreateWorkflowActions = (
  clickAnalyze: (sqlNum?: number) => void,
  onCreateWhitelist: (record?: IAuditTaskSQLResV2) => void,
  handleClickSqlRewritten: (record: IAuditTaskSQLResV2) => void
): ActiontechTableActionsWithPermissions<IAuditTaskSQLResV2> => {
  return [
    {
      key: 'jumpAnalyze',
      text: t('execWorkflow.audit.table.analyze'),
      buttonProps: (record) => {
        return {
          onClick: (e) => {
            e.stopPropagation();
            clickAnalyze(record?.number);
          }
        };
      }
    },
    // #if [ee]
    {
      key: 'create-exception',
      text: t('execWorkflow.audit.table.createWhitelist'),
      buttonProps: (record) => {
        return {
          onClick: (e) => {
            e.stopPropagation();
            onCreateWhitelist(record);
          }
        };
      },
      permissions: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CREATE_WHITE_LIST
    },
    // #endif
    {
      key: 'sqlRewriter',
      text: t('sqlRewrite.actionName'),
      buttonProps: (record) => {
        return {
          icon: <RobotOutlined height={18} width={18} />,
          onClick: (e) => {
            e.stopPropagation();
            handleClickSqlRewritten(record!);
          }
        };
      }
    }
  ];
};
