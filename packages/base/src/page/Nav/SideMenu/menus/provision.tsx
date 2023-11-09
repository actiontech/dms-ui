import { t } from '../../../../locale';
import {
  IconSubmenuExpandDown,
  IconSubmenuExpandTop,
  IconOperateAndAudit,
  IconPermissionGroup,
  IconPermissionTemplate,
  IconAuthList
} from '../../../../icon/sideMenu';
import Icon from '@ant-design/icons';
import {
  GenerateMenuItemsType,
  MenuItemWithOrder,
  SIDE_MENU_DATA_PLACEHOLDER_KEY,
  isAdminKeys
} from './common';

export const ProvisionMenuItems: GenerateMenuItemsType = ({
  navigate,
  projectID = ''
}) => [
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
  }
];
