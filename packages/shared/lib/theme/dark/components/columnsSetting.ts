import { ColumnsSettingTheme } from '../../theme.type';
import { darkThemeBasic, darkThemeUI } from '../basic';

const columnsSettingTheme: ColumnsSettingTheme = {
  dropdown: {
    backgroundColor: darkThemeUI.uiToken.colorBgBase,
    boxShadow: `0px 3px 12px 0px #332C1F1A`,
    border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    title: {
      color: darkThemeUI.uiToken.colorTextTertiary
    },
    item: {
      hoverBackgroundColor: darkThemeUI.uiToken.colorFillTertiary,
      labelColor: darkThemeUI.uiToken.colorTextBase,
      iconColor: darkThemeBasic.basic.colorFontGrayByWhite
    }
  }
};

export default columnsSettingTheme;
