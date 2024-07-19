/* eslint-disable no-template-curly-in-string */
import { Link } from 'react-router-dom';
import {
  MemberFilled,
  ExportFilled,
  DatabaseFilled,
  ComputerFilled
} from '@actiontech/icons';
import { t } from '../../../../../locale';
import { GenerateMenuItemType } from './index.type';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';

export const dbServiceMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/project/${projectID}/db-services`}>
      {t('dmsMenu.instance')}
    </Link>
  ),
  icon: <DatabaseFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/db-services`,
  structKey: 'instance'
});

export const memberManagementMenItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/project/${projectID}/member`}>
      {t('dmsMenu.memberAndPermissions')}
    </Link>
  ),
  icon: <MemberFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/member`,
  structKey: 'member'
});

export const cloudBeaverMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/project/${projectID}/cloud-beaver`}>
      {t('dmsMenu.SQLWorkbench')}
    </Link>
  ),
  icon: <ComputerFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/cloud-beaver`,
  structKey: 'cloud-beaver'
});

export const dataExportMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/project/${projectID}/data/export`}>
      {t('dmsMenu.dataExportManagement')}
    </Link>
  ),
  icon: <ExportFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data/export`,
  structKey: 'data-export'
});

const baseMenusCollection = [
  dbServiceMenuItem,
  memberManagementMenItem,
  cloudBeaverMenuItem,
  dataExportMenuItem
];

export default baseMenusCollection;
