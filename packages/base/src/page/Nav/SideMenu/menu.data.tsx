import { MenuProps } from 'antd5';
import { NavigateFunction } from 'react-router-dom';
import { filterAdminMenusWithKey } from './menus/common';

/* IFTRUE_isSQLE */
import { SQLEMenuItems } from './menus/sqle';
/* FITRUE_isSQLE */

/* IFTRUE_isDMS */
import { DMSMenuItems } from './menus/dms';
/* FITRUE_isDMS */

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
    /* IFTRUE_isSQLE */
    SQLEMenuItems({ navigate, projectID }),
    /* FITRUE_isSQLE */

    /* IFTRUE_isDMS */
    DMSMenuItems({ navigate, projectID }),
    /* FITRUE_isDMS */

    /* IFTRUE_isPROVISION */
    ProvisionMenuItems({ navigate, projectID }),
    /* FITRUE_isPROVISION */

    /* IFTRUE_isDIAGNOSIS */
    DiagnosisMenuItems({ navigate, projectID })
    /* FITRUE_isDIAGNOSIS */
  ];

  const menus = allMenus[0] ?? [];

  if (!isAdmin) {
    return filterAdminMenusWithKey(menus);
  }

  return menus.sort((a, b) => a.order - b.order);
};
