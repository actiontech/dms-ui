import { UserRolesType } from '@actiontech/shared/lib/enum';

import {
  CustomMenuItemType,
  GenerateMenuItemType,
  MenuStructTreeKey,
  MenuStructTreeType
} from './index.type';

export const SIDE_MENU_DATA_PLACEHOLDER_KEY = 'projectID';

export const genMenuItemsWithMenuStructTree = (
  projectID: string,
  allMenuItems: GenerateMenuItemType[],
  menuStructTree: MenuStructTreeType,
  userRoles: UserRolesType
): CustomMenuItemType[] => {
  const getMenuItemWithKey = (key: MenuStructTreeKey): CustomMenuItemType => {
    return (
      allMenuItems.find((v) => {
        const menu = v(projectID);
        if (menu?.role) {
          return (
            menu.role.some((role) => userRoles[role]) && menu.structKey === key
          );
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
      const children = item.group.map(getMenuItemWithKey);
      if (children.every((v) => v === null)) {
        return null;
      }
      return {
        type: 'group',
        label: item.label,
        children
      } as CustomMenuItemType;
    }

    return item as CustomMenuItemType;
  });
};
