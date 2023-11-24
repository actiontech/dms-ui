import { MenuProps } from 'antd';
import { NavigateFunction } from 'react-router-dom';
import { filterAdminMenusWithKey } from './common';
import { BaseMenuItems } from './base';

// #if [sqle]
import { SQLEMenuItems } from './sqle';
// #endif

// #if [provision]
import { ProvisionMenuItems } from './provision';
// #endif

export const sideMenuData: (
  navigate: NavigateFunction,
  isAdmin: boolean,
  projectID?: string
) => MenuProps['items'] = (navigate, isAdmin, projectID = '') => {
  const allMenus = [
    ...BaseMenuItems({ navigate, projectID }),

    /* IFTRUE_isSQLE */
    ...SQLEMenuItems({ navigate, projectID }),
    /* FITRUE_isSQLE */

    /* IFTRUE_isPROVISION */
    ...ProvisionMenuItems({ navigate, projectID })
    /* FITRUE_isPROVISION */
  ];

  if (!isAdmin) {
    return filterAdminMenusWithKey(allMenus).sort(
      (a, b) => (a?.order ?? 0) - (b?.order ?? 0)
    );
  }

  return allMenus.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
};
