import { MenuProps, Menu } from 'antd5';
import { SubMenuType } from 'antd/lib/menu/hooks/useItems';
import { useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuListProps } from './index.type';
import { sideMenuData } from '../menus/menu.data';

const MenuList: React.FC<MenuListProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(() => sideMenuData(navigate), [navigate]);

  const selectMenu = useCallback(
    (config: MenuProps['items'] = [], pathname: string): string[] => {
      for (const route of config) {
        if (!route) {
          return [];
        }
        if (route.key === pathname) {
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
    []
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
  console.log(menuItems);
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
