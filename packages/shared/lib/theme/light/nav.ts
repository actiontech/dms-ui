import { lightThemeBasic, lightThemeUI } from './basic';
import { NavTheme } from '../theme.type';

export const navTheme: NavTheme = {
  width: 220,
  padding: 16,
  backgroundColor: lightThemeUI.uiToken.colorFillQuaternary,
  boxShadow: `2px 0 6px 0 rgba(51, 48, 41, 0.04)`,
  border: `1px solid ${lightThemeBasic.basic.colorGrayLine}`,
  title: {
    color: [lightThemeUI.uiToken.colorPrimary, lightThemeUI.uiToken.colorText]
  },
  menu: {
    hoverBackgroundColor: lightThemeUI.uiToken.colorFillSecondary,
    labelColor: lightThemeUI.uiToken.colorTextSecondary,
    hoverLabelColor: lightThemeUI.uiToken.colorText,
    dividerColor: lightThemeBasic.basic.colorGrayLine,
    groupLabelColor: lightThemeUI.uiToken.colorTextTertiary
  },
  globalSystem: {
    backgroundColor: lightThemeUI.uiToken.colorFillTertiary
  },
  userNavigate: {
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    backgroundColor: lightThemeUI.uiToken.colorFillQuaternary,
    boxShadow: '0 3px 12px 0 rgba(51, 44, 31, 0.10)',
    title: {
      border: `1px solid ${lightThemeBasic.basic.colorGrayLine}`,
      color: lightThemeUI.uiToken.colorText
    },
    content: {
      color: lightThemeUI.uiToken.colorText,
      hoverBackgroundColor: lightThemeUI.uiToken.colorFillSecondary,
      disabledColor: lightThemeUI.uiToken.colorTextTertiary
    },
    footer: {
      text: {
        color: lightThemeUI.uiToken.colorText
      },
      iconWrapper: {
        border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
        backgroundColor: lightThemeUI.uiToken.colorFillTertiary,
        activeBackgroundColor: lightThemeBasic.basic.colorWhite,
        color: lightThemeUI.uiToken.colorTextTertiary,
        activeColor: lightThemeUI.uiToken.colorText
      }
    }
  }
};
