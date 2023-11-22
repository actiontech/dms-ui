import { MenuProps } from 'antd5';
import { NavigateFunction } from 'react-router-dom';
import { filterAdminMenusWithKey } from './common';
import { BaseMenuItems } from './base';

// #if [feature=sqle]
import { SQLEOperateConflictMenuItems, SQLEMenuItems } from './sqle';
// #endif

export const sideMenuData: (
  navigate: NavigateFunction,
  isAdmin: boolean,
  projectID?: string
) => MenuProps['items'] = (navigate, isAdmin, projectID = '') => {
  const allMenus = [
    ...BaseMenuItems({ navigate, projectID }),

    // #if [feature=sqle]
    ...SQLEMenuItems({ navigate, projectID }),
    ...SQLEOperateConflictMenuItems({ navigate, projectID })
    // #endif
  ];

  if (!isAdmin) {
    return filterAdminMenusWithKey(allMenus).sort(
      (a, b) => (a?.order ?? 0) - (b?.order ?? 0)
    );
  }

  return allMenus.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
};
