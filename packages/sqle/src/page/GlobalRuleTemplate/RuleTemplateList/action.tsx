import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/global';
import { t } from '../../../locale';
import {
  CheckboxMultipleBlankFilled,
  LogoutBoxFilled
} from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { parse2ReactRouterPath } from '@actiontech/shared/lib/components/TypedRouter/utils';

export const RuleTemplateListActions = (
  onDelete: (name: string) => void,
  openCloneRuleTemplateModal: (rowData: IRuleTemplateResV1) => void,
  openExportRuleTemplateModal: (rowData: IRuleTemplateResV1) => void
): ActiontechTableActionsWithPermissions<IRuleTemplateResV1> => {
  return {
    buttons: [
      {
        key: 'edit-rule-template',
        text: t('common.edit'),
        permissions: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.EDIT,
        link(record) {
          return {
            to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.RULE_MANAGEMENT.update, {
              params: { templateName: record?.rule_template_name ?? '' }
            })
          };
        }
      },
      {
        key: 'remove-rule-template',
        text: t('common.delete'),
        permissions: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.DELETE,
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('ruleTemplate.deleteRuleTemplate.tips', {
            name: record?.rule_template_name
          }),
          onConfirm: onDelete.bind(null, record?.rule_template_name ?? '')
        })
      }
    ],
    moreButtons: [
      {
        key: 'clone-rule-template',
        text: t('ruleTemplate.cloneRuleTemplate.button'),
        permissions: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.CLONE,
        onClick: (record) => openCloneRuleTemplateModal(record ?? {}),
        icon: <CheckboxMultipleBlankFilled />
      },
      {
        key: 'export-rule-template',
        text: t('ruleTemplate.exportRuleTemplate.button'),
        permissions: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.EXPORT,
        onClick: (record) => openExportRuleTemplateModal(record ?? {}),
        icon: <LogoutBoxFilled />
      }
    ]
  };
};
