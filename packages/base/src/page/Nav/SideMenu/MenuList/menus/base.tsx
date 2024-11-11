import {
  MemberFilled,
  ExportFilled,
  DatabaseFilled,
  ComputerFilled
} from '@actiontech/icons';
import { t } from '../../../../../locale';
import { GenerateMenuItemType } from './index.type';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { TypedLink } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const dbServiceMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.BASE.DATA_SOURCE.index} params={{ projectID }}>
      {t('dmsMenu.instance')}
    </TypedLink>
  ),
  icon: <DatabaseFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/db-services`,
  structKey: 'instance'
});

const memberManagementMenItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.BASE.MEMBER.index} params={{ projectID }}>
      {t('dmsMenu.memberAndPermissions')}
    </TypedLink>
  ),
  icon: <MemberFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/member`,
  structKey: 'member'
});

const cloudBeaverMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.BASE.CLOUD_BEAVER.index} params={{ projectID }}>
      {t('dmsMenu.SQLWorkbench')}
    </TypedLink>
  ),
  icon: <ComputerFilled width={18} height={18} />,
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/cloud-beaver`,
  structKey: 'cloud-beaver'
});

const dataExportMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.BASE.DATA_EXPORT.index} params={{ projectID }}>
      {t('dmsMenu.dataExportManagement')}
    </TypedLink>
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
