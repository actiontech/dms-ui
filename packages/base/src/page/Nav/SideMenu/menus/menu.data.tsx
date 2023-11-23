import { MenuProps } from 'antd';
import { NavigateFunction } from 'react-router-dom';
import { filterAdminMenusWithKey } from './common';
import { BaseMenuItems } from './base';

/* IFTRUE_isSQLE */
import { SQLEOperateConflictMenuItems, SQLEMenuItems } from './sqle';
/* FITRUE_isSQLE */

export const sideMenuData: (
  navigate: NavigateFunction,
  isAdmin: boolean,
  projectID?: string
) => MenuProps['items'] = (navigate, isAdmin, projectID = '') => {
  const allMenus = [
    ...BaseMenuItems({ navigate, projectID }),

    /* IFTRUE_isSQLE */
    ...SQLEMenuItems({ navigate, projectID }),
    ...SQLEOperateConflictMenuItems({ navigate, projectID })
    /* FITRUE_isSQLE */
  ];

  if (!isAdmin) {
    return filterAdminMenusWithKey(allMenus).sort(
      (a, b) => (a?.order ?? 0) - (b?.order ?? 0)
    );
  }

  return allMenus.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
};
