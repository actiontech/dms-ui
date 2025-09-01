import { CustomMonacoEditorTheme } from '../../theme.type';
import { lightThemeUI } from '../basic';

const customMonacoEditorTheme: CustomMonacoEditorTheme = {
  border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
  marginBackgroundColor: lightThemeUI.uiToken.colorFillTertiary,
  marginViewOverlaysColor: lightThemeUI.uiToken.colorTextTertiary,
  linesContentBackgroundColor: lightThemeUI.uiToken.colorFillQuaternary
};

export default customMonacoEditorTheme;
