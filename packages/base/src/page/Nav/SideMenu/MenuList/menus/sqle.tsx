import { Link } from 'react-router-dom';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import {
  IconAuditPlan,
  IconEllipse,
  IconOperateAndAudit,
  IconPluginAudit,
  IconProjectOverview,
  IconRuleTemplate,
  IconSQLOrder,
  IconSqlAudit,
  IconSqlManagement,
  IconTodoList,
  IconWhitelist,
  IconWorkflowTemplate
} from '../../../../../icon/sideMenu';
import { t } from '../../../../../locale';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { GenerateMenuItemType } from './index.type';
import Icon from '@ant-design/icons';

export const projectOverviewMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/overview`}>
      {t('dmsMenu.projectOverview')}
    </Link>
  ),
  icon: <Icon component={IconProjectOverview} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/overview`,
  structKey: 'project-overview'
});

export const dashboardMenuItem: GenerateMenuItemType = (projectID) => ({
  className: 'menu-todo-list-item',
  label: (
    <>
      <Link to={`/sqle/project/${projectID}/dashboard`}>
        {t('dmsMenu.todoList')}
      </Link>
      <IconEllipse />
    </>
  ),
  icon: <Icon component={IconTodoList} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/dashboard`,
  structKey: 'dashboard'
});

export const sqlAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-audit`}>
      {t('dmsMenu.sqlAudit')}
    </Link>
  ),
  icon: <Icon component={IconSqlAudit} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-audit`,
  structKey: 'sql-audit'
});

export const pluginAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/plugin-audit`}>
      {t('dmsMenu.pluginAudit')}
    </Link>
  ),
  icon: <Icon component={IconPluginAudit} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/plugin-audit`,
  structKey: 'plugin-audit'
});

export const sqlOrderMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/order`}>{t('dmsMenu.SQLOrder')}</Link>
  ),
  icon: <Icon component={IconSQLOrder} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/order`,
  structKey: 'sql-order'
});

export const sqlManagementMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-management`}>
      {t('dmsMenu.sqlManagement')}
    </Link>
  ),
  icon: <Icon component={IconSqlManagement} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management`,
  structKey: 'sql-management'
});

export const auditPlanMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/audit-plan`}>
      {t('dmsMenu.auditPlan')}
    </Link>
  ),
  icon: <Icon component={IconAuditPlan} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit-plan`,
  structKey: 'audit-plane'
});

export const projectRuleTemplateMenuItem: GenerateMenuItemType = (
  projectID
) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/rule/template`}>
      {t('dmsMenu.ruleTemplate')}
    </Link>
  ),
  icon: <Icon component={IconRuleTemplate} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/rule/template`,
  structKey: 'rule-template'
});

export const whiteListMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/whitelist`}>
      {t('dmsMenu.whitelist')}
    </Link>
  ),
  icon: <Icon component={IconWhitelist} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/whitelist`,
  structKey: 'whitelist'
});

export const workflowTemplateMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/progress`}>
      {t('dmsMenu.workflowTemplate')}
    </Link>
  ),
  icon: <Icon component={IconWorkflowTemplate} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/progress`,
  structKey: 'workflow-template'
});

export const sqleOperationRecordMenuItem: GenerateMenuItemType = (
  projectID
) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/operation-record`}>
      {t('dmsMenu.operateAndAudit')}
    </Link>
  ),
  icon: <Icon component={IconOperateAndAudit} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/operation-record`,
  structKey: 'sqle-log',
  role: [SystemRole.admin]
});
