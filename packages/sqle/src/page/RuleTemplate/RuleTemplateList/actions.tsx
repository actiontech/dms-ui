import { t } from '../../../locale';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/global';
import { IProjectRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  LogoutBoxFilled,
  CheckboxMultipleBlankFilled,
  PlusOutlined,
  LoginBoxOutlined
} from '@actiontech/icons';
import { ActionButton } from '@actiontech/shared';

export const RuleTemplateTableActions = (
  onAction: (
    record: IProjectRuleTemplateResV1 | undefined,
    type: string
  ) => void
): ActiontechTableActionsWithPermissions<IProjectRuleTemplateResV1> => {
  return {
    buttons: [
      {
        text: t('common.edit'),
        key: 'edit-project-template',
        buttonProps: (record) => {
          return {
            onClick: () => {
              onAction(record, 'edit');
            }
          };
        },
        permissions: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.EDIT
      },
      {
        text: t('common.delete'),
        key: 'delete-project-template',
        buttonProps: (record) => ({
          danger: true
        }),
        confirm: (record) => {
          return {
            title: t('ruleTemplate.deleteRuleTemplate.tips', {
              name: record?.rule_template_name
            }),
            onConfirm: () => {
              onAction(record, 'delete');
            }
          };
        },
        permissions: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.DELETE
      }
    ],
    moreButtons: [
      {
        key: 'clone-rule-template',
        text: t('ruleTemplate.cloneRuleTemplate.button'),
        onClick: (record) => onAction(record, 'clone'),
        icon: <CheckboxMultipleBlankFilled />,
        permissions: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.CLONE
      },
      {
        key: 'export-rule-template',
        text: t('ruleTemplate.exportRuleTemplate.button'),
        onClick: (record) => onAction(record, 'export'),
        icon: <LogoutBoxFilled />,
        permissions: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.EXPORT
      }
    ]
  };
};

export const RuleTemplatePageHeaderActions = (
  projectID: string
): Record<
  'export-rule-template' | 'create-rule-template',
  React.ReactNode
> => ({
  'export-rule-template': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.IMPORT}
    >
      <ActionButton
        icon={<LoginBoxOutlined />}
        text={t('ruleTemplate.importRuleTemplate.button')}
        actionType="navigate-link"
        link={{
          to: `/sqle/project/${projectID}/rule/template/import`
        }}
      />
    </PermissionControl>
  ),
  'create-rule-template': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.CREATE}
    >
      <ActionButton
        type="primary"
        icon={<PlusOutlined color="currentColor" width={10} height={10} />}
        text={t('ruleTemplate.createRuleTemplate.button')}
        actionType="navigate-link"
        link={{
          to: `/sqle/project/${projectID}/rule/template/create`
        }}
      />
    </PermissionControl>
  )
});
