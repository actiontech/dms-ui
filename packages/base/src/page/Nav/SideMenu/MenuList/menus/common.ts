import {
  CustomMenuItemType,
  MenuItemTranslatedConfig,
  MenuTreeKey,
  MenuTreeTranslated
} from './index.type';

export const SIDE_MENU_DATA_PLACEHOLDER_KEY = 'projectID';

export const genMenuItemsWithMenuStructTree = (
  allMenuItems: MenuItemTranslatedConfig[],
  menuStructTree: MenuTreeTranslated[]
): CustomMenuItemType[] => {
  const getMenuItemWithKey = (key: MenuTreeKey): CustomMenuItemType => {
    return (
      allMenuItems.find((menu) => {
        return menu?.structKey === key;
      }) ?? null
    );
  };

  return menuStructTree.map<CustomMenuItemType>((item) => {
    if (typeof item === 'string') {
      return getMenuItemWithKey(item);
    }

    if (item.type === 'group') {
      const children = item.groups.map(getMenuItemWithKey);
      if (children.every((v) => v === null)) {
        return null;
      }
      return {
        type: 'group',
        permission: item.permission,
        label: item.label,
        children
      } as CustomMenuItemType;
    }

    return item as CustomMenuItemType;
  });
};
