import Icon from '@ant-design/icons';
import { t } from '../../../../../locale';
import {
  IconAuthAudit,
  IconAuthList,
  IconPermissionGroup,
  IconPermissionTemplate,
  IconTemplateAudit
} from '../../../../../icon/sideMenu';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { Link } from 'react-router-dom';
import { GenerateMenuItemType } from './index.type';

export const permissionGroupMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/provision/project/${projectID}/data/operation`}>
      {t('dmsMenu.permissionGroup')}
    </Link>
  ),

  key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data/operation`,
  icon: <Icon component={IconPermissionGroup} />,
  structKey: 'permission-group'
});

export const accountManagementMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/provision/project/${projectID}/database-account`}>
      {t('dmsMenu.databaseAccount')}
    </Link>
  ),

  key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/database-account`,
  icon: <Icon component={IconAuthList} />,
  structKey: 'account-management'
});

export const passwordManagementMenuItem: GenerateMenuItemType = (
  projectID
) => ({
  label: (
    <Link to={`/provision/project/${projectID}/database-account-password`}>
      {t('dmsMenu.databaseAccountPassword')}
    </Link>
  ),

  key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/database-account-password`,
  icon: <Icon component={IconPermissionTemplate} />,
  structKey: 'password-management'
});

export const authAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/provision/project/${projectID}/audit/auth`}>
      {t('dmsMenu.authAudit')}
    </Link>
  ),

  key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit/auth`,
  icon: <Icon component={IconAuthAudit} />,
  structKey: 'auth-audit'
});

export const templateAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/provision/project/${projectID}/audit/template`}>
      {t('dmsMenu.templateAudit')}
    </Link>
  ),

  key: `provision/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit/template`,
  icon: <Icon component={IconTemplateAudit} />,
  structKey: 'template-audit'
});

const provisionMenusCollection = [
  authAuditMenuItem,
  permissionGroupMenuItem,
  templateAuditMenuItem,
  accountManagementMenuItem,
  passwordManagementMenuItem
];

export default provisionMenusCollection;
