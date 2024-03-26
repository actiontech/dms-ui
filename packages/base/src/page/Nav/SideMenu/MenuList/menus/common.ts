import { MenuProps } from 'antd';
import { ItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import { Key } from 'react';
import { NavigateFunction } from 'react-router-dom';

export type CustomMenuItemType =
  | (ItemType & {
      order?: number;
      parentKey?: string;
    })
  | null;

export type GenerateMenuItemsType = (arg: {
  navigate: NavigateFunction;
  projectID?: string;
}) => CustomMenuItemType[];

export const SIDE_MENU_DATA_PLACEHOLDER_KEY = 'projectID';

export const isAdminKeys = {
  operate: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/operation-record`
} as const;

export const filterAdminMenusWithKey = (
  menus: MenuProps['items']
): CustomMenuItemType[] => {
  return (
    menus?.filter((v) => {
      const menu = v as SubMenuType;
      if (menu.children) {
        menu.children = filterAdminMenusWithKey(menu.children) ?? [];
      }

      return Object.keys(isAdminKeys).every((e) => {
        const isAdminKey = e as keyof typeof isAdminKeys;
        return isAdminKeys[isAdminKey] !== menu?.key;
      });
    }) ?? []
  );
};

export const rearrangeMenuItemsByParentKey = (
  menus: CustomMenuItemType[]
): CustomMenuItemType[] => {
  const itemMap = new Map<Key, CustomMenuItemType>();

  menus.forEach((item) => {
    if (item && item.key) {
      itemMap.set(item.key, item);
    }
  });

  const rootItems: CustomMenuItemType[] = [];

  menus.forEach((item) => {
    if (item && item.parentKey && itemMap.has(item.parentKey)) {
      const parentItem = itemMap.get(item.parentKey)! as SubMenuType;
      parentItem.children?.push(item);
    } else {
      rootItems.push(item);
    }
  }, []);

  return rootItems;
};
