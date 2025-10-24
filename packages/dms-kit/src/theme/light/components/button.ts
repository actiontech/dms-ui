import { BasicButtonTheme } from '../../theme.type';
import { lightThemeBasic, lightThemeUI } from '../basic';

const basicButtonTheme: BasicButtonTheme = {
  default: {
    default: {
      background: lightThemeBasic.basic.colorWhite,
      color: lightThemeUI.uiToken.colorText,
      boxShadow: `0 1px 4px 0 ${lightThemeBasic.basic.colorShadowByWhite}`
    },
    hover: {
      background: '#F7F6F4'
    },
    active: {
      background: '#F2F1EF'
    },
    disabled: {
      background: lightThemeBasic.basic.colorWhite,
      color: lightThemeBasic.basic.colorFontGrayByWhite
    }
  },
  primary: {
    default: {
      background: lightThemeUI.uiToken.colorPrimary,
      color: lightThemeBasic.basic.colorWhite,
      boxShadow: `0 1px 4px 0 ${lightThemeBasic.basic.colorPrimaryShadow}`
    },
    hover: {
      background: lightThemeBasic.basic.colorPrimaryHover
    },
    active: {
      background: lightThemeBasic.basic.colorPrimaryActive
    },
    disabled: {
      background: lightThemeBasic.basic.colorPrimaryDisabled,
      color: lightThemeBasic.basic.colorWhite
    }
  },
  dangerous: {
    default: {
      color: lightThemeUI.uiToken.colorError
    },
    disabled: {
      color: lightThemeBasic.basic.colorDangerousActive
    }
  },
  dashed: {
    default: {
      border: `1px dashed ${lightThemeUI.uiToken.colorBorder}`
    }
  },
  link: {
    default: {
      color: lightThemeUI.uiToken.colorPrimary
    },
    hover: {
      color: '#69b1ff'
    }
  }
};

export default basicButtonTheme;
