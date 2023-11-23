import { darkThemeUI } from '@actiontech/shared/lib/theme/dark/basic';
import { SideMenuTheme } from '../type';

export const sideMenuTheme: SideMenuTheme = {
  suffixIconColor: darkThemeUI.uiToken.colorTextQuaternary,
  projectSelector: {
    dropdown: {
      labelColor: darkThemeUI.uiToken.colorTextBase,
      iconColor: darkThemeUI.uiToken.colorTextQuaternary,
      activeIconColor: '#EBAD1C',
      groupLabelColor: darkThemeUI.uiToken.colorTextTertiary
    }
  }
};
