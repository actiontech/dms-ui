import {
  lightThemeBasic,
  lightThemeUI
} from '@actiontech/shared/lib/theme/light/basic';
import { UserManagementTheme } from '../type';

export const userManagementTheme: UserManagementTheme = {
  permissionType: {
    border: `1px solid ${lightThemeBasic.basic.colorGrayLine}`,
    backgroundColor: lightThemeUI.uiToken.colorFillTertiary,
    color: lightThemeUI.uiToken.colorTextSecondary,
    activeBackgroundColor: lightThemeBasic.basic.colorPrimaryBgHover,
    activeColor: lightThemeUI.uiToken.colorPrimary
  }
};
