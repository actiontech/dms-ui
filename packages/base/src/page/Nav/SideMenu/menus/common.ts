import { MenuProps } from 'antd5';
import { ItemType, SubMenuType } from 'antd5/es/menu/hooks/useItems';
import { NavigateFunction } from 'react-router-dom';

export type MenuItemWithOrder = ItemType & {
  order: number;
};

export type CustomMenuItemType = MenuItemWithOrder & {
  conflict?: {
    id: string;
    transform: (
      isConflict: boolean,
      _self: MenuItemWithOrder,
      other: MenuItemWithOrder[]
    ) => MenuItemWithOrder | null;
  };
};

export type GenerateMenuItemsType = (arg: {
  navigate: NavigateFunction;
  projectID?: string;
}) => Array<CustomMenuItemType>;

export const SIDE_MENU_DATA_PLACEHOLDER_KEY = 'projectID';

export const isAdminKeys = {
  operate: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/operationRecord`
};

export const filterAdminMenusWithKey = (
  menus: MenuProps['items']
): MenuProps['items'] => {
  return menus?.filter((v) => {
    const menu = v as SubMenuType;
    if (menu.children) {
      menu.children = filterAdminMenusWithKey(menu.children) ?? [];
    }

    return Object.keys(isAdminKeys).every((e) => {
      const isAdminKey = e as keyof typeof isAdminKeys;
      return isAdminKeys[isAdminKey] !== menu?.key;
    });
  });
};
