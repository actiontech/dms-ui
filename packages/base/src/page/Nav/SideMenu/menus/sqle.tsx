import { t } from '../../../../locale';
import {
  IconAuditPlan,
  IconEllipse,
  IconOperateAndAudit,
  IconProjectOverview,
  IconRuleTemplate,
  IconSQLOrder,
  IconSqlAudit,
  IconSqlManagement,
  IconTodoList,
  IconWhitelist,
  IconWorkflowTemplate
} from '../../../../icon/sideMenu';
import Icon from '@ant-design/icons';
import {
  GenerateMenuItemsType,
  SIDE_MENU_DATA_PLACEHOLDER_KEY,
  isAdminKeys
} from './common';

export const SQLEMenuItems: GenerateMenuItemsType = ({
  navigate,
  projectID = ''
}) => [
  {
    order: 1,
    label: t('dmsMenu.projectOverview'),
    icon: <Icon component={IconProjectOverview} />,
    key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/overview`,
    onClick: () => navigate(`/sqle/project/${projectID}/overview`)
  },
  {
    order: 2,
    className: 'menu-todo-list-item',
    label: (
      <>
        <span>{t('dmsMenu.todoList')}</span>
        <IconEllipse />
      </>
    ),
    icon: <Icon component={IconTodoList} />,
    key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/dashboard`,
    onClick: () => navigate(`/sqle/project/${projectID}/dashboard`)
  },
  // #if [dms]
  {
    order: 5,
    label: t('dmsMenu.SQLEOperateRecord'),
    key: isAdminKeys.operate,
    onClick: () => navigate(`/sqle/project/${projectID}/operationRecord`),
    parentKey: 'operateAndAudit'
  },
  // #else
  {
    order: 5,
    label: t('dmsMenu.operateAndAudit'),
    icon: <Icon component={IconOperateAndAudit} />,
    key: isAdminKeys.operate,
    onClick: () => navigate(`/sqle/project/${projectID}/operationRecord`),
    parentKey: 'operateAndAudit'
  },
  // #endif
  {
    order: 7,
    type: 'divider'
  },
  {
    order: 8,
    type: 'group',
    label: t('dmsMenu.groupLabel.SQLAudit'),
    children: [
      {
        label: t('dmsMenu.ruleTemplate'),
        key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/rule/template`,
        icon: <Icon component={IconRuleTemplate} />,
        onClick: () => navigate(`/sqle/project/${projectID}/rule/template`)
      },
      {
        label: t('dmsMenu.whitelist'),
        key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/whitelist`,
        icon: <Icon component={IconWhitelist} />,
        onClick: () => navigate(`/sqle/project/${projectID}/whitelist`)
      },
      {
        label: t('dmsMenu.workflowTemplate'),
        key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/progress`,
        icon: <Icon component={IconWorkflowTemplate} />,
        onClick: () => navigate(`/sqle/project/${projectID}/progress`)
      },
      {
        label: t('dmsMenu.sqlManagement'),
        icon: <Icon component={IconSqlManagement} />,
        key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sqlManagement`,
        onClick: () => navigate(`/sqle/project/${projectID}/sqlManagement`)
      },
      {
        label: t('dmsMenu.sqlAudit'),
        key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sqlAudit`,
        icon: <Icon component={IconSqlAudit} />,
        onClick: () => navigate(`/sqle/project/${projectID}/sqlAudit`)
      },
      {
        label: t('dmsMenu.SQLOrder'),
        key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/order`,
        icon: <Icon component={IconSQLOrder} />,
        onClick: () => navigate(`/sqle/project/${projectID}/order`)
      },
      {
        label: t('dmsMenu.auditPlan'),
        key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/auditPlan`,
        icon: <Icon component={IconAuditPlan} />,
        onClick: () => navigate(`/sqle/project/${projectID}/auditPlan`)
      }
    ]
  }
];

export const SQLEOperateConflictMenuItems: GenerateMenuItemsType = ({
  navigate,
  projectID = ''
}) => [
  {
    order: 5,
    label: t('dmsMenu.operateAndAudit'),
    icon: <Icon component={IconOperateAndAudit} />,
    key: isAdminKeys.operate,
    onClick: () => navigate(`/sqle/project/${projectID}/operationRecord`)
  }
];
