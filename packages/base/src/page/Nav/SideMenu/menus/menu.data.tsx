import { MenuProps } from 'antd';
import { NavigateFunction } from 'react-router-dom';
import { filterAdminMenusWithKey } from './common';
import { BaseOperateConflictMenuItemsWrapper, BaseMenuItems } from './base';

/* IFTRUE_isSQLE */
import { SQLEOperateConflictMenuItems, SQLEMenuItems } from './sqle';
/* FITRUE_isSQLE */

/* IFTRUE_isPROVISION */
import {
  ProvisionOperateConflictMenuItems,
  ProvisionMenuItems
} from './provision';
/* FITRUE_isPROVISION */

/* IFTRUE_isDIAGNOSIS */
import { DiagnosisMenuItems } from './diagnosis';
/* FITRUE_isDIAGNOSIS */

export const sideMenuData: (
  navigate: NavigateFunction,
  isAdmin: boolean,
  projectID?: string
) => MenuProps['items'] = (navigate, isAdmin, projectID = '') => {
  const allMenus = [
    ...BaseMenuItems({ navigate, projectID }),

    ...BaseOperateConflictMenuItemsWrapper(
      [
        /* IFTRUE_isPROVISION */
        ...ProvisionOperateConflictMenuItems({ navigate, projectID }),
        /* FITRUE_isPROVISION */

        /* IFTRUE_isSQLE */
        ...SQLEOperateConflictMenuItems({ navigate, projectID })
        /* FITRUE_isSQLE */
      ],
      /* IFTRUE_isPROVISION */
      /* IFTRUE_isSQLE */
      true
      /* FITRUE_isSQLE */
      /* FITRUE_isPROVISION */
    ),

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
    return filterAdminMenusWithKey(allMenus).sort(
      (a, b) => (a?.order ?? 0) - (b?.order ?? 0)
    );
  }

  return allMenus.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
};
