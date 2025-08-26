import { lightThemeUI } from '../basic';
import { BasicInputTheme } from '../../theme.type';

const basicInputTheme: BasicInputTheme = {
  default: {
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    placeholder: {
      color: lightThemeUI.uiToken.colorTextQuaternary
    },
    dataCountColor: lightThemeUI.uiToken.colorTextQuaternary
  },
  hover: {
    border: `1px solid ${lightThemeUI.uiToken.colorBorder}`
  },
  focus: {
    border: `1px solid ${lightThemeUI.uiToken.colorPrimary}`,
    caretColor: lightThemeUI.uiToken.colorPrimary
  },
  error: {
    border: `1px solid ${lightThemeUI.uiToken.colorError}`
  },
  disabled: {
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    background: lightThemeUI.uiToken.colorFillTertiary
  }
};

export default basicInputTheme;
