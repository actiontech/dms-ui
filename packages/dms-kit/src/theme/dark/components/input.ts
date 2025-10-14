import { darkThemeUI } from '../basic';
import { BasicInputTheme } from '../../theme.type';

const basicInputTheme: BasicInputTheme = {
  default: {
    border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    placeholder: {
      color: darkThemeUI.uiToken.colorTextQuaternary
    },
    dataCountColor: darkThemeUI.uiToken.colorTextQuaternary
  },
  hover: {
    border: `1px solid ${darkThemeUI.uiToken.colorBorder}`
  },
  focus: {
    border: `1px solid ${darkThemeUI.uiToken.colorPrimary}`,
    caretColor: darkThemeUI.uiToken.colorPrimary
  },
  error: {
    border: `1px solid ${darkThemeUI.uiToken.colorError}`
  },
  disabled: {
    border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    background: darkThemeUI.uiToken.colorFillTertiary
  }
};

export default basicInputTheme;
