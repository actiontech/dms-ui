import { CustomSelectTheme } from '../../theme.type';
import { lightThemeUI } from '../basic';

const customSelectTheme: CustomSelectTheme = {
  searchInput: {
    borderBottom: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    hoverBorderBottom: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`
  },
  placeholder: {
    color: lightThemeUI.uiToken.colorTextTertiary
  },
  content: {
    prefixColor: lightThemeUI.uiToken.colorTextTertiary,
    labelColor: lightThemeUI.uiToken.colorText
  },

  border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
  iconColor: lightThemeUI.uiToken.colorFillSecondary,
  hoverBackgroundColor: lightThemeUI.uiToken.colorFillTertiary,
  focusBackGroundColor: lightThemeUI.uiToken.colorFillSecondary,
  disabled: {
    border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    background: lightThemeUI.uiToken.colorFillTertiary
  }
};

export default customSelectTheme;
