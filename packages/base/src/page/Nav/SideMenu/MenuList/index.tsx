import { MenuProps, Menu } from 'antd';
import { SubMenuType } from 'antd/lib/menu/hooks/useItems';
import { useMemo, useCallback } from 'react';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from '../menus/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuListProps } from './index.type';
import { sideMenuData } from '../menus/menu.data';

const MenuList: React.FC<MenuListProps> = ({ isAdmin, projectID }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(
    () => sideMenuData(navigate, isAdmin, projectID),
    [navigate, isAdmin, projectID]
  );

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
