import { BasicSegmentedTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

const basicSegmentedTheme: BasicSegmentedTheme = {
  color: darkThemeUI.uiToken.colorTextSecondary,
  backgroundColor: darkThemeUI.uiToken.colorFillSecondary,
  hoverBackgroundColor: darkThemeUI.uiToken.colorFill,
  noticeCountColor: darkThemeUI.uiToken.colorError,
  active: {
    color: darkThemeUI.uiToken.colorPrimary,
    border: darkThemeUI.uiToken.colorFillTertiary,
    boxShadow: `0px 1px 4px 0px rgba(0, 0, 0, 0.5)`
  }
};

export default basicSegmentedTheme;
