import { t } from '../../../locale';
import {
  IconEllipse,
  IconInstanceManager,
  IconProjectOverview,
  IconTodoList,
  IconSubmenuExpandDown,
  IconSubmenuExpandTop,
  IconMemberAndPermissions,
  IconOperateAndAudit,
  IconSQLQuery,
  IconRuleTemplate,
  IconWhitelist,
  IconWorkflowTemplate,
  IconSQLOrder,
  IconAuditPlan,
  IconPermissionGroup,
  IconPermissionTemplate,
  IconAuthList,
  IconInspectionAndDiagnosis
} from '../../../icon/sideMenu';
import Icon from '@ant-design/icons/lib/components/Icon';
import { MenuProps } from 'antd5';
import { NavigateFunction } from 'react-router-dom';
import { SubMenuType } from 'antd5/es/menu/hooks/useItems';

export const menuDataPlaceholderKey = 'projectID';

export const isAdminKeys = {
  operate: `sqle/project/${menuDataPlaceholderKey}/operationRecord`
};

const filterAdminMenusWithKey = (
  menus: MenuProps['items']
): MenuProps['items'] => {
  return menus?.filter((v) => {
    const menu = v as SubMenuType;
    if (menu.children) {
      menu.children = filterAdminMenusWithKey(menu.children) ?? [];
    }

    return Object.keys(isAdminKeys).every((e) => {
      const isAdminKey = e as keyof typeof isAdminKeys;
      return isAdminKeys[isAdminKey] !== menu?.key;
    });
  });
};

//todo 1. ee and ce 2. icon color
export const sideMenuData: (
  navigate: NavigateFunction,
  isAdmin: boolean,
  projectID?: string
) => MenuProps['items'] = (navigate, isAdmin, projectID = '') => {
  const menus: MenuProps['items'] = [
    /* IFTRUE_isSQLE */
    {
      label: t('dmsMenu.projectOverview'),
      icon: <Icon component={IconProjectOverview} />,
      key: `sqle/project/${menuDataPlaceholderKey}/overview`,
      onClick: () => navigate(`/sqle/project/${projectID}/overview`)
    },
    {
      className: 'menu-todo-list-item',
      label: (
        <>
          <span>{t('dmsMenu.todoList')}</span>
          <IconEllipse />
        </>
      ),
      icon: <Icon component={IconTodoList} />,
      key: `sqle/project/${menuDataPlaceholderKey}/dashboard`,
      onClick: () => navigate(`/sqle/project/${projectID}/dashboard`)
    },
    /* FITRUE_isSQLE */

    {
      label: t('dmsMenu.instanceManager'),
      expandIcon({ isOpen }) {
        return isOpen ? <IconSubmenuExpandTop /> : <IconSubmenuExpandDown />;
      },
      icon: <IconInstanceManager />,
      key: 'instanceManage',
      children: [
        {
          label: t('dmsMenu.instance'),
          key: `project/${menuDataPlaceholderKey}/db-services`,
          onClick: () => navigate(`/project/${projectID}/db-services`)
        },
        {
          label: t('dmsMenu.externalInstance'),
          key: `project/${menuDataPlaceholderKey}/syncDataSource`,
          onClick: () => navigate(`/project/${projectID}/syncDataSource`)
        }
      ]
    },
    {
      label: t('dmsMenu.memberAndPermissions'),
      icon: <Icon component={IconMemberAndPermissions} />,
      key: `project/${menuDataPlaceholderKey}/member`,
      onClick: () => navigate(`/project/${projectID}/member`)
    },

    /* IFTRUE_isEE */
    /* IFTRUE_isPROVISION */
    {
      label: t('dmsMenu.operateAndAudit'),
      expandIcon({ isOpen }) {
        return isOpen ? <IconSubmenuExpandTop /> : <IconSubmenuExpandDown />;
      },
      icon: <Icon component={IconOperateAndAudit} />,
      key: 'operate',
      children: [
        {
          label: t('dmsMenu.authAudit'),
          key: `provision/project/${menuDataPlaceholderKey}/audit/auth`,
          onClick: () => navigate(`/provision/project/${projectID}/audit/auth`)
        },
        {
          label: t('dmsMenu.templateAudit'),
          key: `provision/project/${menuDataPlaceholderKey}/audit/template`,
          onClick: () =>
            navigate(`/provision/project/${projectID}/audit/template`)
        },
        {
          label: t('dmsMenu.instanceAudit'),
          key: `provision/project/${menuDataPlaceholderKey}/audit/service`,
          onClick: () =>
            navigate(`/provision/project/${projectID}/audit/service`)
        },

        /* IFTRUE_isSQLE */
        {
          label: t('dmsMenu.SQLEOperateRecord'),
          key: isAdminKeys.operate,
          onClick: () => navigate(`/sqle/project/${projectID}/operationRecord`)
        }
        /* FITRUE_isSQLE */
      ]
    },
    /* FITRUE_isPROVISION */

    /* IFTRUE_isONLY_SQLE */
    {
      label: t('dmsMenu.operateAndAudit'),
      icon: <Icon component={IconOperateAndAudit} />,
      key: isAdminKeys.operate,
      onClick: () => navigate(`/sqle/project/${projectID}/operationRecord`)
    },
    /* FITRUE_isONLY_SQLE */

    /* FITRUE_isEE */

    //todo
    // {
    //   label: t('dmsMenu.inspectionAndDiagnosis'),
    //   key: 'inspect',
    //   icon: <Icon component={IconInspectionAndDiagnosis} />
    // },

    /* IFTRUE_isSQLE */
    {
      label: t('dmsMenu.SQLQuery'),
      icon: <Icon component={IconSQLQuery} />,
      key: `cloudBeaver`,
      onClick: () => navigate(`cloudBeaver`)
    },
    {
      type: 'divider'
    },

    {
      type: 'group',
      label: t('dmsMenu.groupLabel.SQLAudit'),
      children: [
        {
          label: t('dmsMenu.ruleTemplate'),
          key: `sqle/project/${menuDataPlaceholderKey}/rule/template`,
          icon: <Icon component={IconRuleTemplate} />,
          onClick: () => navigate(`/sqle/project/${projectID}/rule/template`)
        },
        {
          label: t('dmsMenu.whitelist'),
          key: `sqle/project/${menuDataPlaceholderKey}/whitelist`,
          icon: <Icon component={IconWhitelist} />,
          onClick: () => navigate(`/sqle/project/${projectID}/whitelist`)
        },
        {
          label: t('dmsMenu.workflowTemplate'),
          key: `sqle/project/${menuDataPlaceholderKey}/progress`,
          icon: <Icon component={IconWorkflowTemplate} />,
          onClick: () => navigate(`/sqle/project/${projectID}/progress`)
        },
        {
          label: t('dmsMenu.SQLOrder'),
          key: `sqle/project/${menuDataPlaceholderKey}/order`,
          icon: <Icon component={IconSQLOrder} />,
          onClick: () => navigate(`/sqle/project/${projectID}/order`)
        },
        {
          label: t('dmsMenu.auditPlan'),
          key: `sqle/project/${menuDataPlaceholderKey}/auditPlan`,
          icon: <Icon component={IconAuditPlan} />,
          onClick: () => navigate(`/sqle/project/${projectID}/auditPlan`)
        }
      ]
    },
    /* FITRUE_isSQLE */

    /* IFTRUE_isPROVISION */
    {
      type: 'divider'
    },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.dataSecurity'),
      children: [
        {
          label: t('dmsMenu.permissionGroup'),
          key: `provision/project/${menuDataPlaceholderKey}/data/operation`,
          icon: <Icon component={IconPermissionGroup} />,
          onClick: () =>
            navigate(`/provision/project/${projectID}/data/operation`)
        },
        {
          label: t('dmsMenu.permissionTemplate'),
          key: `provision/project/${menuDataPlaceholderKey}/auth/template`,
          icon: <Icon component={IconPermissionTemplate} />,
          onClick: () =>
            navigate(`/provision/project/${projectID}/auth/template`)
        },
        {
          label: t('dmsMenu.authList'),
          key: `provision/project/${menuDataPlaceholderKey}/auth/list`,
          icon: <Icon component={IconAuthList} />,
          onClick: () => navigate(`/provision/project/${projectID}/auth/list`)
        }
        // {
        //   label: t('dmsMenu.permissionOrder'),
        //   key: 'permissionOrder',
        //   icon: <Icon component={IconPermissionOrder} />
        // }
      ]
    },
    /* FITRUE_isPROVISION */

    /* IFTRUE_isDIAGNOSIS */
    {
      type: 'divider'
    },
    {
      type: 'group',
      label: t('dmsMenu.inspectionAndDiagnosis'),
      children: [
        {
          label: t('dmsMenu.monitorSourceConfig'),
          key: `diagno/project/${menuDataPlaceholderKey}/monitorSourceConfig`,
          icon: <Icon component={IconInspectionAndDiagnosis} />,
          onClick: () =>
            navigate(`/diagno/project/${projectID}/monitorSourceConfig`)
        }
      ]
    }
    /* FITRUE_isDIAGNOSIS */
  ];

  if (!isAdmin) {
    return filterAdminMenusWithKey(menus);
  }

  return menus;
};
