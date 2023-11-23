import { lightThemeUI } from '@actiontech/shared/lib/theme/light/basic';
import { SideMenuTheme } from '../type';

export const sideMenuTheme: SideMenuTheme = {
  suffixIconColor: lightThemeUI.uiToken.colorTextQuaternary,
  projectSelector: {
    dropdown: {
      labelColor: lightThemeUI.uiToken.colorTextBase,
      iconColor: lightThemeUI.uiToken.colorTextQuaternary,
      activeIconColor: '#EBAD1C',
      groupLabelColor: lightThemeUI.uiToken.colorTextTertiary
    }
  }
};
