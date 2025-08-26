import { CustomSelectTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

const customSelectTheme: CustomSelectTheme = {
  searchInput: {
    borderBottom: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    hoverBorderBottom: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`
  },
  placeholder: {
    color: darkThemeUI.uiToken.colorTextTertiary
  },
  content: {
    prefixColor: darkThemeUI.uiToken.colorTextTertiary,
    labelColor: darkThemeUI.uiToken.colorText
  },

  border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
  iconColor: darkThemeUI.uiToken.colorFillSecondary,
  hoverBackgroundColor: darkThemeUI.uiToken.colorFillTertiary,
  focusBackGroundColor: darkThemeUI.uiToken.colorFillSecondary,
  disabled: {
    border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    background: darkThemeUI.uiToken.colorFillTertiary
  }
};

export default customSelectTheme;
