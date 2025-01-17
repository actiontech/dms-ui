import { t } from '../../../locale';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { ActionButton } from '@actiontech/shared';

export const RuleKnowledgeEditActions = (
  onEdit: () => void,
  loading: boolean
): Record<'edit-rule-knowledge', React.ReactNode> => ({
  'edit-rule-knowledge': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.RULE_KNOWLEDGE.EDIT}
    >
      <ActionButton
        type="primary"
        text={t('ruleKnowledge.edit')}
        onClick={onEdit}
        disabled={loading}
      />
    </PermissionControl>
  )
});
