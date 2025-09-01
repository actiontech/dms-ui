import { ActionButton } from '@actiontech/shared';
import { t } from '../../../locale';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { ReactNode } from 'react';
type Params = {
  exportPending: boolean;
  onExport: () => void;
  auditPending: boolean;
  onAuditImmediately: () => void;
};
export const SqlManagementConfDetailPageHeaderActions = ({
  exportPending,
  onAuditImmediately,
  onExport,
  auditPending
}: Params): Record<'export' | 'immediately_audit', ReactNode> => {
  return {
    export: (
      <ActionButton
        disabled={exportPending}
        onClick={onExport}
        text={t('managementConf.detail.export')}
      />
    ),
    immediately_audit: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF.DETAIL_AUDIT}
      >
        <ActionButton
          loading={auditPending}
          onClick={onAuditImmediately}
          type="primary"
          text={t('managementConf.detail.auditImmediately')}
        />
      </PermissionControl>
    )
  };
};
