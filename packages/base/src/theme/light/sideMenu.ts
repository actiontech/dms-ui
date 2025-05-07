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
  },
  availabilityZoneSelector: {
    dropdown: {
      boxShadowColor:
        '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
    }
  }
};
