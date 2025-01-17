import { LoginBoxOutlined, PlusOutlined } from '@actiontech/icons';
import { ActionButton } from '@actiontech/shared';
import {
  PermissionControl,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { ReactNode } from 'react';
import { RuleManagerSegmentedKey } from './index.type';
import { t } from '../../locale';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const RuleManagerPageHeaderActions = (
  activeKey: RuleManagerSegmentedKey
): Record<
  'import_rule_template' | 'create_rule_template' | 'create_custom_rule',
  ReactNode
> => {
  return {
    import_rule_template: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.IMPORT}
      >
        <ActionButton
          text={t('ruleTemplate.importRuleTemplate.button')}
          hidden={activeKey !== RuleManagerSegmentedKey.GlobalRuleTemplate}
          icon={<LoginBoxOutlined />}
          actionType="navigate-link"
          link={{ to: ROUTE_PATHS.SQLE.RULE_MANAGEMENT.import }}
        />
      </PermissionControl>
    ),
    create_rule_template: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.CREATE}
      >
        <ActionButton
          text={t('ruleTemplate.createRuleTemplate.button')}
          hidden={activeKey !== RuleManagerSegmentedKey.GlobalRuleTemplate}
          type="primary"
          icon={<PlusOutlined color="currentColor" width={10} height={10} />}
          actionType="navigate-link"
          link={{ to: ROUTE_PATHS.SQLE.RULE_MANAGEMENT.create }}
        />
      </PermissionControl>
    ),
    create_custom_rule: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.CREATE}
      >
        <ActionButton
          text={t('customRule.filterForm.add')}
          hidden={activeKey !== RuleManagerSegmentedKey.CustomRule}
          type="primary"
          actionType="navigate-link"
          link={{ to: ROUTE_PATHS.SQLE.CUSTOM_RULE.create }}
        />
      </PermissionControl>
    )
  };
};
