import { BasicRangePickerTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

const basicRangePickerTheme: BasicRangePickerTheme = {
  default: {
    border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    placeholder: {
      color: darkThemeUI.uiToken.colorTextQuaternary
    }
  },
  hover: {
    border: `1px solid ${darkThemeUI.uiToken.colorBorder}`
  },
  active: {
    border: `1px solid ${darkThemeUI.uiToken.colorPrimary}`
  },
  error: {
    border: `1px solid ${darkThemeUI.uiToken.colorError}`
  },
  disabled: {
    border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    background: darkThemeUI.uiToken.colorFillTertiary
  }
};

export default basicRangePickerTheme;
