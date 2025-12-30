import { darkThemeUI } from '@actiontech/dms-kit/es/theme/dark/basic';
import { SystemTheme } from '../type';

export const systemTheme: SystemTheme = {
  configButton: {
    backgroundColor: darkThemeUI.uiToken.colorFillSecondary,
    border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`
  },
  logo: {
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.5)'
  }
};
