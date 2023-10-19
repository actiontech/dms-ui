import { CustomFilterRangePickerTheme } from '../../theme.type';
import { lightThemeUI } from '../basic';

export const customFilterRangePickerTheme: CustomFilterRangePickerTheme = {
  borderColor: lightThemeUI.uiToken.colorBorderSecondary,
  placeholder: {
    color: lightThemeUI.uiToken.colorTextTertiary
  },
  hoverBackgroundColor: lightThemeUI.uiToken.colorFillTertiary,
  focusBackgroundColor: lightThemeUI.uiToken.colorFillTertiary,
  filterLabelColor: lightThemeUI.uiToken.colorTextTertiary
};
