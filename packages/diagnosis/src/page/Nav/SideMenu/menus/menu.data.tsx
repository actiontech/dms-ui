import { MenuProps } from 'antd';
import { NavigateFunction } from 'react-router-dom';
import { DiagnosisMenuItems } from './index';

export const sideMenuData: (
  navigate: NavigateFunction
) => MenuProps['items'] = (navigate) => {
  const allMenus = [...DiagnosisMenuItems({ navigate })];

  return allMenus.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
};
