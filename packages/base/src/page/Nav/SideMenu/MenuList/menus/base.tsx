/* eslint-disable no-template-curly-in-string */
import { Link } from 'react-router-dom';
import {
  IconSubmenuExpandTop,
  IconSubmenuExpandDown,
  IconInstanceManager,
  IconMemberAndPermissions,
  IconCloudBeaver,
  IconDataExport
} from '../../../../../icon/sideMenu';
import { t } from '../../../../../locale';
import { GenerateMenuItemType } from './index.type';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import Icon from '@ant-design/icons';

export const dbServiceManagementMenuItem: GenerateMenuItemType = (
  projectID
) => ({
  label: t('dmsMenu.instanceManager'),
  expandIcon({ isOpen }) {
    return isOpen ? <IconSubmenuExpandTop /> : <IconSubmenuExpandDown />;
  },
  icon: <IconInstanceManager />,
  key: 'instance-management',
  structKey: 'instance-management',
  children: [
    {
      label: (
        <Link to={`/project/${projectID}/db-services`}>
          {t('dmsMenu.instance')}
        </Link>
      ),
      key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/db-services`
    },
    {
      label: (
        <Link to={`/project/${projectID}/sync-data-source`}>
          {t('dmsMenu.externalInstance')}
        </Link>
      ),
      key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sync-data-source`
    }
  ]
});

export const memberManagementMenItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/project/${projectID}/member`}>
      {t('dmsMenu.memberAndPermissions')}
    </Link>
  ),
  icon: <Icon component={IconMemberAndPermissions} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/member`,
  structKey: 'member'
});

export const cloudBeaverMenuItem: GenerateMenuItemType = (_) => ({
  label: <Link to={`/cloud-beaver`}>{t('dmsMenu.SQLWorkbench')}</Link>,
  icon: <Icon component={IconCloudBeaver} />,
  key: `cloud-beaver`,
  structKey: 'cloud-beaver'
});

export const dataExportMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/project/${projectID}/data/export`}>
      {t('dmsMenu.dataExportManagement')}
    </Link>
  ),
  icon: <Icon component={IconDataExport} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data/export`,
  structKey: 'data-export'
});

const baseMenusCollection = [
  dbServiceManagementMenuItem,
  memberManagementMenItem,
  cloudBeaverMenuItem,
  dataExportMenuItem
];

export default baseMenusCollection;
