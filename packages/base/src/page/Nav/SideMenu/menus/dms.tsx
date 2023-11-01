import { t } from '../../../../locale';
import {
  IconEllipse,
  IconProjectOverview,
  IconTodoList,
  IconSubmenuExpandDown,
  IconSubmenuExpandTop,
  IconOperateAndAudit,
  IconRuleTemplate,
  IconWhitelist,
  IconWorkflowTemplate,
  IconSQLOrder,
  IconAuditPlan,
  IconPermissionGroup,
  IconPermissionTemplate,
  IconAuthList,
  IconInspectionAndDiagnosis
} from '../../../../icon/sideMenu';
import Icon from '@ant-design/icons';
import {
  GenerateMenuItemsType,
  SIDE_MENU_DATA_PLACEHOLDER_KEY,
  isAdminKeys
} from './common';
import { BaseMenuItems } from './base';

export const DMSMenuItems: GenerateMenuItemsType = ({
  navigate,
  projectID = ''
}) => [
  ...BaseMenuItems({ navigate, projectID }),
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
  {
    order: 5,
    label: t('dmsMenu.operateAndAudit'),
    expandIcon({ isOpen }) {
      return isOpen ? <IconSubmenuExpandTop /> : <IconSubmenuExpandDown />;
    },
    icon: <Icon component={IconOperateAndAudit} />,
    key: 'operate',
    children: [
      {
        label: t('dmsMenu.authAudit'),
        key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit/auth`,
        onClick: () => navigate(`/provision/project/${projectID}/audit/auth`)
      },
      {
        label: t('dmsMenu.templateAudit'),
        key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit/template`,
        onClick: () =>
          navigate(`/provision/project/${projectID}/audit/template`)
      },
      {
        label: t('dmsMenu.instanceAudit'),
        key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit/service`,
        onClick: () => navigate(`/provision/project/${projectID}/audit/service`)
      },

      {
        label: t('dmsMenu.SQLEOperateRecord'),
        key: isAdminKeys.operate,
        onClick: () => navigate(`/sqle/project/${projectID}/operationRecord`)
      }
    ]
  },
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
  },
  {
    order: 9,
    type: 'divider'
  },
  {
    order: 10,
    type: 'group',
    label: t('dmsMenu.groupLabel.dataSecurity'),
    children: [
      {
        label: t('dmsMenu.permissionGroup'),
        key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data/operation`,
        icon: <Icon component={IconPermissionGroup} />,
        onClick: () =>
          navigate(`/provision/project/${projectID}/data/operation`)
      },
      {
        label: t('dmsMenu.permissionTemplate'),
        key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/auth/template`,
        icon: <Icon component={IconPermissionTemplate} />,
        onClick: () => navigate(`/provision/project/${projectID}/auth/template`)
      },
      {
        label: t('dmsMenu.authList'),
        key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/auth/list`,
        icon: <Icon component={IconAuthList} />,
        onClick: () => navigate(`/provision/project/${projectID}/auth/list`)
      }
    ]
  },
  {
    order: 11,
    type: 'divider'
  },
  {
    order: 12,
    type: 'group',
    label: t('dmsMenu.inspectionAndDiagnosis'),
    children: [
      {
        label: t('dmsMenu.monitorSourceConfig'),
        key: `diagnosis/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/monitorSourceConfig`,
        icon: <Icon component={IconInspectionAndDiagnosis} />,
        onClick: () =>
          navigate(`/diagnosis/project/${projectID}/monitorSourceConfig`)
      }
    ]
  }
];
