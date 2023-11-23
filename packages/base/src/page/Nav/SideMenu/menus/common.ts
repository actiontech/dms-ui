import { MenuProps } from 'antd';
import { ItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import { NavigateFunction } from 'react-router-dom';

export type CustomMenuItemType =
  | (ItemType & {
      order?: number;
    })
  | null;

export type GenerateMenuItemsType = (arg: {
  navigate: NavigateFunction;
  projectID?: string;
}) => CustomMenuItemType[];

export const SIDE_MENU_DATA_PLACEHOLDER_KEY = 'projectID';

export const isAdminKeys = {
  operate: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/operationRecord`
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
