import { darkThemeBasic, darkThemeUI } from './basic';
import { NavTheme } from '../theme.type';

export const navTheme: NavTheme = {
  width: 220,
  padding: 16,
  backgroundColor: darkThemeUI.uiToken.colorFillQuaternary,
  boxShadow: `2px 0 6px 0 rgba(51, 48, 41, 0.04)`,
  border: `1px solid ${darkThemeUI.uiToken.colorFillQuaternary}`,
  title: {
    color: [darkThemeUI.uiToken.colorPrimary, darkThemeUI.uiToken.colorText]
  },
  menu: {
    hoverBackgroundColor: darkThemeUI.uiToken.colorFillSecondary,
    labelColor: darkThemeUI.uiToken.colorTextSecondary,
    hoverLabelColor: darkThemeUI.uiToken.colorText,
    dividerColor: darkThemeBasic.basic.colorGrayLine,
    groupLabelColor: darkThemeUI.uiToken.colorTextTertiary
  },
  globalSystem: {
    backgroundColor: darkThemeUI.uiToken.colorFillTertiary
  },
  userNavigate: {
    border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    backgroundColor: darkThemeUI.uiToken.colorFillQuaternary,
    boxShadow: '0 3px 12px 0 rgba(51, 44, 31, 0.10)',
    title: {
      border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
      color: darkThemeUI.uiToken.colorText
    },
    content: {
      color: darkThemeUI.uiToken.colorText,
      hoverBackgroundColor: darkThemeUI.uiToken.colorFillSecondary,
      disabledColor: darkThemeUI.uiToken.colorTextTertiary
    },
    footer: {
      text: {
        color: darkThemeUI.uiToken.colorText
      },
      iconWrapper: {
        border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
        backgroundColor: darkThemeUI.uiToken.colorFillTertiary,
        activeBackgroundColor: darkThemeBasic.basic.colorWhite,
        color: darkThemeUI.uiToken.colorTextTertiary,
        activeColor: darkThemeUI.uiToken.colorText
      }
    }
  }
};
