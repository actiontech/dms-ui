import { TableTheme } from '../../theme.type';
import { darkThemeBasic, darkThemeUI } from '../basic';

const tableTheme: TableTheme = {
  thead: {
    color: darkThemeUI.uiToken.colorTextTertiary,
    border: '1px solid #F2F1F0'
  },
  row: {
    color: darkThemeUI.uiToken.colorTextBase,
    border: `1px solid #F2F1F0`,
    moreButtonInActions: {
      backgroundColor: darkThemeUI.uiToken.colorBgBase,
      color: darkThemeUI.uiToken.colorTextBase,
      border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
      boxShadow: `0px 3px 12px 0px rgba(51, 44, 31, 0.10)`,
      hoverItemBackgroundColor: darkThemeUI.uiToken.colorFillSecondary
    }
  },
  pagination: {
    backgroundColor: darkThemeUI.uiToken.colorBgBase,
    border: `1px solid #F2F1F0`,
    total: {
      color: darkThemeUI.uiToken.colorTextSecondary
    },
    item: {
      color: darkThemeUI.uiToken.colorTextTertiary,
      hoverBackgroundColor: darkThemeUI.uiToken.colorFillSecondary,
      activeBackgroundColor: darkThemeBasic.basic.colorWhite,
      activeBorder: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
      activeColor: darkThemeUI.uiToken.colorText
    },
    options: {
      backgroundColor: darkThemeBasic.basic.colorWhite,
      border: `1px solid #F2F1F0`,
      boxShadow: `0px 1px 4px 0px #332C1F1F`,
      hoverBorder: `1px solid #F2F1F0`,
      itemColor: darkThemeUI.uiToken.colorTextTertiary
    }
  }
};

export default tableTheme;
