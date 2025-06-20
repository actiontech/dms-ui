import { MenuProps, Menu } from 'antd';
import { SubMenuType } from 'antd/lib/menu/hooks/useItems';
import { useMemo, useCallback } from 'react';
import {
  SIDE_MENU_DATA_PLACEHOLDER_KEY,
  genMenuItemsWithMenuStructTree
} from './menus/common';
import { useLocation } from 'react-router-dom';
import { usePermission } from '@actiontech/shared/lib/features';
import {
  CustomMenuItemType,
  GenerateMenuItemI18nConfig,
  MenuItemTranslatedConfig,
  MenuTreeI18n,
  MenuTreeTranslated
} from './menus/index.type';
import { SQLE_ALL_MENUS, SQLE_MENU_STRUCT } from './menus/menu.data';
import { DMS_ALL_MENUS, DMS_MENU_STRUCT } from './menus/menu.data.dms';
import { useTranslation } from 'react-i18next';
import { TypedLink } from '@actiontech/shared';

type Props = {
  projectID: string;
};

const MenuList: React.FC<Props> = ({ projectID }) => {
  const location = useLocation();
  const { checkPagePermission, userOperationPermissions } = usePermission();
  const { t } = useTranslation();

  const menuItems = useMemo(() => {
    let menus: CustomMenuItemType[] = [];

    const translatedMenuStruct = (
      menuTree: MenuTreeI18n[]
    ): MenuTreeTranslated[] => {
      return menuTree.map((tree) => {
        if (typeof tree !== 'string' && tree.type === 'group') {
          return {
            ...tree,
            label: t(tree.groupLabelKey)
          };
        }
        return tree;
      });
    };

    const translatedMenuItem = (
      requiredMenus: GenerateMenuItemI18nConfig[]
    ): MenuItemTranslatedConfig[] => {
      return requiredMenus.map((item) => {
        const menu = item(projectID);
        return {
          ...menu,
          label: <TypedLink to={menu.to}>{t(menu.label)}</TypedLink>
        };
      });
    };

    // #if [sqle && !dms]
    menus = genMenuItemsWithMenuStructTree(
      translatedMenuItem(SQLE_ALL_MENUS),
      translatedMenuStruct(SQLE_MENU_STRUCT)
    );
    // #else
    menus = genMenuItemsWithMenuStructTree(
      translatedMenuItem(DMS_ALL_MENUS),
      translatedMenuStruct(DMS_MENU_STRUCT)
    );
    // #endif
    const filterMenusByPermissions = (
      requiredMenus: CustomMenuItemType[]
    ): CustomMenuItemType[] => {
      return requiredMenus.filter((menu) => {
        if (menu?.permission && userOperationPermissions) {
          return checkPagePermission(menu.permission);
        }

        if ((menu as SubMenuType)?.children) {
          (menu as SubMenuType).children = filterMenusByPermissions(
            (menu as SubMenuType).children as CustomMenuItemType[]
          );
        }

        return true;
      });
    };

    return filterMenusByPermissions(menus).filter((menu) => {
      if (menu && 'children' in menu) {
        return (menu as SubMenuType).children.length > 0;
      }
      return true;
    });
  }, [projectID, t, checkPagePermission, userOperationPermissions]);

  const selectMenu = useCallback(
    (config: MenuProps['items'] = [], pathname: string): string[] => {
      for (const route of config) {
        if (!route) {
          continue;
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
