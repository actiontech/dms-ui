// @warn/cli/create-dms-page

import {
  MemberFilled,
  ExportFilled,
  DatabaseFilled,
  ComputerFilled
} from '@actiontech/icons';
import { GenerateMenuItemI18nConfig } from './index.type';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { parse2ReactRouterPath } from '@actiontech/shared';
import { PERMISSIONS } from '@actiontech/shared/lib/features';

const dbServiceMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  to: parse2ReactRouterPath(ROUTE_PATHS.BASE.DATA_SOURCE.index, {
    params: { projectID }
  }),
  label: 'dmsMenu.instance',
  icon: <DatabaseFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/db-services`,
  structKey: 'instance',
  permission: PERMISSIONS.PAGES.BASE.DB_SERVICE
});

const memberManagementMenItem: GenerateMenuItemI18nConfig = (projectID) => ({
  to: parse2ReactRouterPath(ROUTE_PATHS.BASE.MEMBER.index, {
    params: { projectID }
  }),
  label: 'dmsMenu.memberAndPermissions',
  icon: <MemberFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/member`,
  structKey: 'member',
  permission: PERMISSIONS.PAGES.BASE.MEMBER
});

const cloudBeaverMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  to: parse2ReactRouterPath(ROUTE_PATHS.BASE.CLOUD_BEAVER.index, {
    params: { projectID }
  }),
  label: 'dmsMenu.SQLWorkbench',
  icon: <ComputerFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/cloud-beaver`,
  structKey: 'cloud-beaver'
});

const dataExportMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  to: parse2ReactRouterPath(ROUTE_PATHS.BASE.DATA_EXPORT.index, {
    params: { projectID }
  }),
  label: 'dmsMenu.dataExportManagement',
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
