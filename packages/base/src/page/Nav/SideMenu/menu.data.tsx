import { MenuProps } from 'antd5';
import { NavigateFunction } from 'react-router-dom';
import { filterAdminMenusWithKey } from './menus/common';
import { BaseMenuItems } from './menus/base';

/* IFTRUE_isSQLE */
import { SQLEMenuItems } from './menus/sqle';
/* FITRUE_isSQLE */

/* IFTRUE_isPROVISION */
import { ProvisionMenuItems } from './menus/provision';
/* FITRUE_isPROVISION */

/* IFTRUE_isDIAGNOSIS */
import { DiagnosisMenuItems } from './menus/diagnosis';
/* FITRUE_isDIAGNOSIS */

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
    ...ProvisionMenuItems({ navigate, projectID }),
    /* FITRUE_isPROVISION */

    /* IFTRUE_isDIAGNOSIS */
    ...DiagnosisMenuItems({ navigate, projectID })
    /* FITRUE_isDIAGNOSIS */
  ];

  if (!isAdmin) {
    return filterAdminMenusWithKey(allMenus);
  }

  return allMenus.sort((a, b) => a.order - b.order);
};
