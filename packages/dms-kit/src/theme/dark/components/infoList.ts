import { BasicInfoListTheme } from '../../theme.type';
import { darkThemeBasic, darkThemeUI } from '../basic';

const basicInfoListTheme: BasicInfoListTheme = {
  borderRadius: '8px',
  bodyBoxShadow: 'none',
  title: {
    border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
    backgroundColor: darkThemeUI.uiToken.colorFillTertiary,
    color: darkThemeUI.uiToken.colorTextSecondary,
    fontSize: '13px',
    fontWeight: 500
  },
  value: {
    border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
    color: darkThemeUI.uiToken.colorTextTertiary,
    fontSize: '13px',
    fontWeight: 500
  }
};

export default basicInfoListTheme;
