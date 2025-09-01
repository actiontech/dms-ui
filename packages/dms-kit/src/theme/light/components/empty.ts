import { BasicEmptyTheme } from '../../theme.type';
import { lightThemeBasic, lightThemeUI } from '../basic';

const basicEmptyTheme: BasicEmptyTheme = {
  title: {
    color: lightThemeUI.uiToken.colorTextTertiary,
    fontSize: '16px',
    fontWeight: 500
  },
  info: {
    color: lightThemeBasic.basic.colorFontGrayByWhite,
    fontSize: '13px',
    fontWeight: 400
  },
  description: lightThemeUI.uiToken.colorTextQuaternary
};

export default basicEmptyTheme;
