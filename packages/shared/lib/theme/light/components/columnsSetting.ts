import { ColumnsSettingTheme } from '../../theme.type';
import { lightThemeBasic, lightThemeUI } from '../basic';

const columnsSettingTheme: ColumnsSettingTheme = {
  dropdown: {
    backgroundColor: lightThemeUI.uiToken.colorBgBase,
    boxShadow: `0px 3px 12px 0px #332C1F1A`,
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    title: {
      color: lightThemeUI.uiToken.colorTextTertiary
    },
    item: {
      hoverBackgroundColor: lightThemeUI.uiToken.colorFillTertiary,
      labelColor: lightThemeUI.uiToken.colorTextBase,
      iconColor: lightThemeBasic.basic.colorFontGrayByWhite
    }
  }
};

export default columnsSettingTheme;
