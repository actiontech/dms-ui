import { t } from '../../../../../locale';
import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';
import {
  PERMISSIONS,
  ActiontechTableActionsWithPermissions
} from '@actiontech/shared/lib/features';

export const AuditResultForCreateOrderActions = (
  onCreateWhitelist: (record?: IListDataExportTaskSQL) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleClickSqlRewritten: (record: IListDataExportTaskSQL) => void
): ActiontechTableActionsWithPermissions<IListDataExportTaskSQL> => {
  return [
    {
      key: 'create-exception',
      text: t('dmsDataExport.common.auditResult.column.createWhitelist'),
      buttonProps: (record) => {
        return {
          onClick: (e) => {
            e.stopPropagation();
            onCreateWhitelist(record);
          }
        };
      },
      permissions: PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.CREATE_WHITELIST
    }
    // {
    //   key: 'sqlRewriter',
    //   text: t('sqlRewrite.actionName'),
    //   buttonProps: (record) => {
    //     return {
    //       icon: <RobotOutlined height={18} width={18} />,
    //       onClick: (e) => {
    //         e.stopPropagation();
    //         handleClickSqlRewritten(record!);
    //       }
    //     };
    //   }
    // }
  ];
};
