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
  },
  dropdown: {
    icon: {
      boxShadow: '0 1px 4px 0 rgba(51, 44, 31, 0.12)'
    }
  }
};

export default basicRangePickerTheme;
