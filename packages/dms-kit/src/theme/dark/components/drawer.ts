import { BasicDrawerTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

const basicDrawerTheme: BasicDrawerTheme = {
  backgroundColor: darkThemeUI.uiToken.colorFillQuaternary,
  boxShadow: `-20px 0px 40px 0px rgba(0, 0, 0, 0.5)`,
  color: darkThemeUI.uiToken.colorText
};

export default basicDrawerTheme;
