import { CustomMonacoEditorTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

const customMonacoEditorTheme: CustomMonacoEditorTheme = {
  border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
  marginBackgroundColor: darkThemeUI.uiToken.colorFillQuaternary,
  marginViewOverlaysColor: darkThemeUI.uiToken.colorTextTertiary,
  linesContentBackgroundColor: darkThemeUI.uiToken.colorFillQuaternary
};

export default customMonacoEditorTheme;
