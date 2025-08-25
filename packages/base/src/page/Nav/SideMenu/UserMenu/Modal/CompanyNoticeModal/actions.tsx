import { ActionButton } from '@actiontech/shared';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { t } from '../../../../../../locale';
export const CompanyNoticeModalActions = (
  onClick: () => void
): Record<'edit-notice', React.ReactNode> => {
  return {
    'edit-notice': (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.NAV.EDIT_SYSTEM_NOTICE}
      >
        <ActionButton
          type="primary"
          text={t('common.edit')}
          onClick={onClick}
        />
      </PermissionControl>
    )
  };
};
