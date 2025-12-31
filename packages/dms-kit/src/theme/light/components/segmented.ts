import { BasicSegmentedTheme } from '../../theme.type';
import { lightThemeUI } from '../basic';

const basicSegmentedTheme: BasicSegmentedTheme = {
  color: lightThemeUI.uiToken.colorTextSecondary,
  backgroundColor: lightThemeUI.uiToken.colorFillSecondary,
  hoverBackgroundColor: lightThemeUI.uiToken.colorFill,
  active: {
    color: lightThemeUI.uiToken.colorPrimary,
    border: lightThemeUI.uiToken.colorFillTertiary,
    boxShadow: `0px 1px 4px 0px #332C1F1F`
  },
  noticeCountColor: lightThemeUI.uiToken.colorError
};

export default basicSegmentedTheme;
