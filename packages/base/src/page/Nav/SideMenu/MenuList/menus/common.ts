import { SystemRole } from '@actiontech/shared/lib/enum';
import {
  cloudBeaverMenuItem,
  dataExportMenuItem,
  dbServiceManagementMenuItem,
  memberManagementMenItem
} from './base';
import {
  CustomMenuItemType,
  GenerateMenuItemType,
  MenuStructTreeKey,
  MenuStructTreeType
} from './index.type';
import {
  projectOverviewMenuItem,
  dashboardMenuItem,
  sqlAuditMenuItem,
  pluginAuditMenuItem,
  sqlOrderMenuItem,
  sqlManagementMenuItem,
  auditPlanMenuItem,
  projectRuleTemplateMenuItem,
  whiteListMenuItem,
  workflowTemplateMenuItem,
  sqleOperationRecordMenuItem
} from './sqle';

export const SIDE_MENU_DATA_PLACEHOLDER_KEY = 'projectID';

export const genMenuItemsWithMenuStructTree = (
  projectID: string,
  menuStructTree: MenuStructTreeType,
  role: SystemRole | ''
): CustomMenuItemType[] => {
  const allMenuItems: GenerateMenuItemType[] = [
    dbServiceManagementMenuItem,
    memberManagementMenItem,
    cloudBeaverMenuItem,
    dataExportMenuItem,

    // #if [sqle]
    projectOverviewMenuItem,
    dashboardMenuItem,
    sqlAuditMenuItem,
    pluginAuditMenuItem,
    sqlOrderMenuItem,
    sqlManagementMenuItem,
    auditPlanMenuItem,
    projectRuleTemplateMenuItem,
    whiteListMenuItem,
    workflowTemplateMenuItem,
    sqleOperationRecordMenuItem
    // #endif
  ];

  const getMenuItemWithKey = (key: MenuStructTreeKey): CustomMenuItemType => {
    return (
      allMenuItems.find((v) => {
        const menu = v(projectID);
        if (menu?.role) {
          return menu.role.includes(role) && menu.structKey === key;
        }

        return menu?.structKey === key;
      })?.(projectID) ?? null
    );
  };

  return menuStructTree.map<CustomMenuItemType>((item) => {
    if (typeof item === 'string') {
      return getMenuItemWithKey(item);
    }

    if (item.type === 'group') {
      return {
        type: 'group',
        label: item.label,
        children: item.group.map(getMenuItemWithKey)
      } as CustomMenuItemType;
    }

    return item as CustomMenuItemType;
  });
};
