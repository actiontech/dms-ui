import { BasicInfoListTheme } from '../../theme.type';
import { lightThemeBasic, lightThemeUI } from '../basic';

const basicInfoListTheme: BasicInfoListTheme = {
  borderRadius: '8px',
  bodyBoxShadow: 'none',
  title: {
    border: `1px solid ${lightThemeBasic.basic.colorGrayLine}`,
    backgroundColor: lightThemeUI.uiToken.colorFillTertiary,
    color: lightThemeUI.uiToken.colorTextSecondary,
    fontSize: '13px',
    fontWeight: 500
  },
  value: {
    border: `1px solid ${lightThemeBasic.basic.colorGrayLine}`,
    color: lightThemeUI.uiToken.colorTextTertiary,
    fontSize: '13px',
    fontWeight: 500
  }
};

export default basicInfoListTheme;
