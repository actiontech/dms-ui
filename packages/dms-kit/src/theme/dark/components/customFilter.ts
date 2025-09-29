import { CustomFilterRangePickerTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

export const customFilterRangePickerTheme: CustomFilterRangePickerTheme = {
  borderColor: darkThemeUI.uiToken.colorBorderSecondary,
  placeholder: {
    color: darkThemeUI.uiToken.colorTextTertiary
  },
  hoverBackgroundColor: darkThemeUI.uiToken.colorFillTertiary,
  focusBackgroundColor: darkThemeUI.uiToken.colorFillTertiary,
  filterLabelColor: darkThemeUI.uiToken.colorTextTertiary
};
