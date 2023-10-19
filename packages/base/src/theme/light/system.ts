import { lightThemeUI } from '@actiontech/shared/lib/theme/light/basic';
import { SystemTheme } from '../type';

export const systemTheme: SystemTheme = {
  configButton: {
    backgroundColor: lightThemeUI.uiToken.colorFillSecondary,
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`
  },
  logo: {
    boxShadow: '0 1px 4px 0 rgba(51, 44, 31, 0.12)'
  }
};
