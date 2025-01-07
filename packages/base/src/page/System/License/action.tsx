import { ActionButton, BasicTooltipProps } from '@actiontech/shared';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { ReactNode } from 'react';
import { t } from '../../../locale';

type Params = {
  collectActionTooltipProps: BasicTooltipProps;
  collectAction: {
    onClick: () => void;
    loading: boolean;
  };
  importAction: {
    onClick: () => void;
  };
};

export const LicenseActions = (
  params: Params
): Record<'collect_license' | 'import_license', ReactNode> => {
  const { collectAction, importAction, collectActionTooltipProps } = params;
  return {
    collect_license: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.SYSTEM.LICENSE.COLLECT_LICENSE}
      >
        <ActionButton
          text={t('dmsSystem.license.collect')}
          type="primary"
          actionType="tooltip"
          tooltip={collectActionTooltipProps}
          {...collectAction}
        />
      </PermissionControl>
    ),
    import_license: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.SYSTEM.LICENSE.IMPORT_LICENSE}
      >
        <ActionButton
          text={t('dmsSystem.license.import')}
          type="primary"
          {...importAction}
        />
      </PermissionControl>
    )
  };
};
