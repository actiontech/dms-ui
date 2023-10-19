import { BasicDrawerTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

const basicDrawerTheme: BasicDrawerTheme = {
  backgroundColor: darkThemeUI.uiToken.colorFillQuaternary,
  boxShadow: `-20px 0px 40px 0px rgba(0, 26, 65, 0.05)`,
  color: darkThemeUI.uiToken.colorText
};

export default basicDrawerTheme;
