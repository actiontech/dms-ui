import { BasicEmptyTheme } from '../../theme.type';
import { darkThemeBasic, darkThemeUI } from '../basic';

const basicEmptyTheme: BasicEmptyTheme = {
  title: {
    color: darkThemeUI.uiToken.colorTextTertiary,
    fontSize: '16px',
    fontWeight: 500
  },
  info: {
    color: darkThemeBasic.basic.colorFontGrayByWhite,
    fontSize: '13px',
    fontWeight: 400
  },
  description: darkThemeUI.uiToken.colorTextQuaternary
};

export default basicEmptyTheme;
