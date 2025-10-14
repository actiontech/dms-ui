import { TableTheme } from '../../theme.type';
import { lightThemeBasic, lightThemeUI } from '../basic';

const tableTheme: TableTheme = {
  thead: {
    color: lightThemeUI.uiToken.colorTextTertiary,
    border: '1px solid #F2F1F0'
  },
  row: {
    color: lightThemeUI.uiToken.colorTextBase,
    border: `1px solid #F2F1F0`,
    moreButtonInActions: {
      backgroundColor: lightThemeUI.uiToken.colorBgBase,
      color: lightThemeUI.uiToken.colorTextBase,
      border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
      boxShadow: `0px 3px 12px 0px rgba(51, 44, 31, 0.10)`,
      hoverItemBackgroundColor: lightThemeUI.uiToken.colorFillSecondary
    }
  },
  pagination: {
    backgroundColor: lightThemeUI.uiToken.colorBgBase,
    border: `1px solid #F2F1F0`,
    total: {
      color: lightThemeUI.uiToken.colorTextSecondary
    },
    item: {
      color: lightThemeUI.uiToken.colorTextTertiary,
      hoverBackgroundColor: lightThemeUI.uiToken.colorFillSecondary,
      activeBackgroundColor: lightThemeBasic.basic.colorWhite,
      activeBorder: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
      activeColor: lightThemeUI.uiToken.colorText
    },
    options: {
      backgroundColor: lightThemeBasic.basic.colorWhite,
      border: `1px solid #F2F1F0`,
      boxShadow: `0px 1px 4px 0px #332C1F1F`,
      hoverBorder: `1px solid #F2F1F0`,
      itemColor: lightThemeUI.uiToken.colorTextTertiary
    }
  }
};

export default tableTheme;
