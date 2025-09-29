import { PageHeaderTheme } from '../../theme.type';
import { lightThemeUI } from '../basic';

const pageHeaderTheme: PageHeaderTheme = {
  borderBottom: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
  background: lightThemeUI.uiToken.colorBgBase,
  title: {
    color: lightThemeUI.uiToken.colorTextBase
  }
};

export default pageHeaderTheme;
