import { t } from '../../../../../locale';
import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';
import {
  PERMISSIONS,
  ActiontechTableActionsWithPermissions
} from '@actiontech/shared/lib/global';

export const AuditResultForCreateOrderActions = (
  onCreateWhitelist: (record?: IListDataExportTaskSQL) => void
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
  ];
};
