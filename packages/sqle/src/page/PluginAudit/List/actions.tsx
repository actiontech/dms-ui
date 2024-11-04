import { t } from '../../../locale';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/global';
import { ISqlDEVRecord } from '@actiontech/shared/lib/api/sqle/service/common';

export const PluginAuditListActions: (
  onCreateWhitelist: (record?: ISqlDEVRecord) => void
) => ActiontechTableActionsWithPermissions<ISqlDEVRecord> = (
  onCreateWhitelist
) => {
  return {
    buttons: [
      {
        key: 'create-exception',
        text: t('pluginAudit.table.createWhitelist'),
        buttonProps: (record) => ({
          onClick: () => onCreateWhitelist(record)
        }),
        permissions: PERMISSIONS.ACTIONS.SQLE.PLUGIN_AUDIT.CREATE_WHITELIST
      }
    ]
  };
};
