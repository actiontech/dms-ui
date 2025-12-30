import { TableTheme } from '../../theme.type';
import { darkThemeBasic, darkThemeUI } from '../basic';

const tableTheme: TableTheme = {
  thead: {
    color: darkThemeUI.uiToken.colorTextTertiary,
    border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`
  },
  row: {
    color: darkThemeUI.uiToken.colorTextBase,
    border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
    moreButtonInActions: {
      backgroundColor: darkThemeUI.uiToken.colorBgBase,
      color: darkThemeUI.uiToken.colorTextBase,
      border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
      boxShadow: `0px 3px 12px 0px rgba(0, 0, 0, 0.4)`,
      hoverItemBackgroundColor: darkThemeUI.uiToken.colorFillSecondary
    }
  },
  pagination: {
    backgroundColor: darkThemeUI.uiToken.colorBgBase,
    border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
    total: {
      color: darkThemeUI.uiToken.colorTextSecondary
    },
    item: {
      color: darkThemeUI.uiToken.colorTextTertiary,
      hoverBackgroundColor: darkThemeUI.uiToken.colorFillSecondary,
      activeBackgroundColor: darkThemeUI.uiToken.colorFillTertiary,
      activeBorder: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
      activeColor: darkThemeUI.uiToken.colorText
    },
    options: {
      backgroundColor: darkThemeUI.uiToken.colorFillTertiary,
      border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
      boxShadow: `0px 1px 4px 0px rgba(0, 0, 0, 0.5)`,
      hoverBorder: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
      itemColor: darkThemeUI.uiToken.colorTextTertiary
    }
  }
};

export default tableTheme;
