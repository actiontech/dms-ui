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
  },
  availabilityZoneSelector: {
    dropdown: {
      boxShadowColor:
        '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
    }
  }
};
