import { MenuProps } from 'antd5';
import { NavigateFunction } from 'react-router-dom';
import { filterAdminMenusWithKey } from './menus/common';

/* IFTRUE_isSQLE */
import { SQLEMenuItems } from './menus/sqle';
/* FITRUE_isSQLE */

export const sideMenuData: (
  navigate: NavigateFunction,
  isAdmin: boolean,
  projectID?: string
) => MenuProps['items'] = (navigate, isAdmin, projectID = '') => {
  const allMenus = [
    /* IFTRUE_isSQLE */
    SQLEMenuItems({ navigate, projectID })
    /* FITRUE_isSQLE */
  ];

  const menus = allMenus[0] ?? [];

  if (!isAdmin) {
    return filterAdminMenusWithKey(menus);
  }

  return menus.sort((a, b) => a.order - b.order);
};
