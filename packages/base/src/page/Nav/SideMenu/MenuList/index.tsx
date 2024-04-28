import { MenuProps, Menu } from 'antd';
import { SubMenuType } from 'antd/lib/menu/hooks/useItems';
import { useMemo, useCallback } from 'react';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './menus/common';
import { useLocation } from 'react-router-dom';
import { MenuListProps } from './index.type';
import { CustomMenuItemType } from './menus/index.type';
import useSystemModuleStatus from '@actiontech/shared/lib/global/useSystemModuleStatus';

// #if [sqle && !dms]
import { sideMenuData } from './menus/menu.data';
// #else
import { dmsSideMenuData } from './menus/menu.data.dms';
// #endif

const MenuList: React.FC<MenuListProps> = ({ role, projectID }) => {
  const location = useLocation();

  const { sqlOptimizationIsSupported } = useSystemModuleStatus();

  const menuItems = useMemo(() => {
    let menus: CustomMenuItemType[] = [];

    // #if [sqle && !dms]
    menus = sideMenuData(projectID, role, sqlOptimizationIsSupported);
    // #else
    menus = dmsSideMenuData(projectID, role);
    // #endif

    return menus;
  }, [projectID, role, sqlOptimizationIsSupported]);

  const selectMenu = useCallback(
    (config: MenuProps['items'] = [], pathname: string): string[] => {
      for (const route of config) {
        if (!route) {
          return [];
        }
        const realPath = `/${route?.key}`.replace(
          SIDE_MENU_DATA_PLACEHOLDER_KEY,
          projectID ?? ''
        );
        if (realPath === pathname) {
          return [(route.key as string) ?? ''];
        }
        if (route) {
          const children = (route as SubMenuType).children;
          if (children) {
            const keys = selectMenu(children, pathname);
            if (keys.length > 0) {
              return keys;
            }
          }
        }
      }
      return [];
    },
    [projectID]
  );

  const selectMenuWrapper = useMemo((): string[] => {
    let pathname = location.pathname;
    let selectKey: string[] = [];
    while (pathname.length > 0) {
      selectKey = selectMenu(menuItems, pathname);
      if (selectKey.length !== 0) {
        return selectKey;
      } else {
        const temp = pathname.split('/');
        temp.pop();
        pathname = temp.join('/');
      }
    }
    return selectKey;
  }, [location.pathname, menuItems, selectMenu]);

  return (
    <Menu
      className="custom-menu"
      mode="inline"
      items={menuItems}
      selectedKeys={selectMenuWrapper}
    />
  );
};

export default MenuList;
