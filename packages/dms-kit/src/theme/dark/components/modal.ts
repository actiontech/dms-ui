import { BasicModalTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

const basicModalTheme: BasicModalTheme = {
  content: {
    backgroundColor: darkThemeUI.uiToken.colorBgBase,
    border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    header: {
      border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
      title: {
        color: darkThemeUI.uiToken.colorText
      }
    },
    body: {
      color: darkThemeUI.uiToken.colorText
    },
    footer: {
      backgroundColor: darkThemeUI.uiToken.colorFillTertiary
    }
  }
};

export default basicModalTheme;
