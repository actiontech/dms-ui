import { BasicModalTheme } from '../../theme.type';
import { lightThemeUI } from '../basic';

const basicModalTheme: BasicModalTheme = {
  content: {
    backgroundColor: lightThemeUI.uiToken.colorBgBase,
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    header: {
      border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
      title: {
        color: lightThemeUI.uiToken.colorText
      }
    },
    body: {
      color: lightThemeUI.uiToken.colorText
    },
    footer: {
      backgroundColor: lightThemeUI.uiToken.colorFillTertiary
    }
  }
};

export default basicModalTheme;
