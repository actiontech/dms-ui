import { PageHeaderTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

const pageHeaderTheme: PageHeaderTheme = {
  borderBottom: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
  background: darkThemeUI.uiToken.colorBgBase,
  title: {
    color: darkThemeUI.uiToken.colorTextBase
  }
};

export default pageHeaderTheme;
