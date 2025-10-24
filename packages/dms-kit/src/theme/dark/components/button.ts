import { BasicButtonTheme } from '../../theme.type';
import { darkThemeBasic, darkThemeUI } from '../basic';

const basicButtonTheme: BasicButtonTheme = {
  default: {
    default: {
      background: darkThemeBasic.basic.colorWhite,
      color: darkThemeUI.uiToken.colorText,
      boxShadow: `0 1px 4px 0 ${darkThemeBasic.basic.colorShadowByWhite}`
    },
    hover: {
      background: '#F7F6F4'
    },
    active: {
      background: '#F2F1EF'
    },
    disabled: {
      background: darkThemeBasic.basic.colorWhite,
      color: darkThemeBasic.basic.colorFontGrayByWhite
    }
  },
  primary: {
    default: {
      background: darkThemeUI.uiToken.colorPrimary,
      color: darkThemeBasic.basic.colorWhite,
      boxShadow: `0 1px 4px 0 ${darkThemeBasic.basic.colorPrimaryShadow}`
    },
    hover: {
      background: darkThemeBasic.basic.colorPrimaryHover
    },
    active: {
      background: darkThemeBasic.basic.colorPrimaryActive
    },
    disabled: {
      background: darkThemeBasic.basic.colorPrimaryDisabled,
      color: darkThemeBasic.basic.colorWhite
    }
  },
  dangerous: {
    default: {
      color: darkThemeUI.uiToken.colorError
    },
    disabled: {
      color: darkThemeBasic.basic.colorDangerousActive
    }
  },
  dashed: {
    default: {
      border: `1px dashed ${darkThemeUI.uiToken.colorBorder}`
    }
  },
  link: {
    default: {
      color: darkThemeUI.uiToken.colorPrimary
    },
    hover: {
      color: '#69b1ff'
    }
  }
};

export default basicButtonTheme;
