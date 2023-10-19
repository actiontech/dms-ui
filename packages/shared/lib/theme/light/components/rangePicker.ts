import { BasicRangePickerTheme } from '../../theme.type';
import { lightThemeUI } from '../basic';

const basicRangePickerTheme: BasicRangePickerTheme = {
  default: {
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    placeholder: {
      color: lightThemeUI.uiToken.colorTextQuaternary
    }
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

export default basicRangePickerTheme;
