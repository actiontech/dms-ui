import { BasicSelectTheme } from '../../theme.type';
import { lightThemeUI } from '../basic';

const basicSelectTheme: BasicSelectTheme = {
  default: {
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    placeholder: {
      color: lightThemeUI.uiToken.colorTextQuaternary
    },
    boxShadow:
      '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
  },
  hover: {
    border: `1px solid ${lightThemeUI.uiToken.colorBorder}`
  },
  active: {
    border: `1px solid ${lightThemeUI.uiToken.colorPrimary}`
  },
  error: {
    border: `1px solid ${lightThemeUI.uiToken.colorError}`
  },
  disabled: {
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    background: lightThemeUI.uiToken.colorFillTertiary
  }
};

export default basicSelectTheme;
