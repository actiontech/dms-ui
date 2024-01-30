import {
  darkThemeBasic,
  darkThemeUI
} from '@actiontech/shared/lib/theme/dark/basic';
import { UserManagementTheme } from '../type';

export const userManagementTheme: UserManagementTheme = {
  permissionType: {
    border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
    backgroundColor: darkThemeUI.uiToken.colorFillTertiary,
    color: darkThemeUI.uiToken.colorTextSecondary,
    activeBackgroundColor: darkThemeBasic.basic.colorPrimaryBgHover,
    activeColor: darkThemeUI.uiToken.colorPrimary
  }
};
