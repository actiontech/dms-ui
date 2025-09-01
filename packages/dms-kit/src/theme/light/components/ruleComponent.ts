import { RuleComponentTheme } from '../../theme.type';
import { lightThemeBasic, lightThemeUI } from '../basic';

const ruleComponentTheme: RuleComponentTheme = {
  ruleStatus: {
    enableColor: lightThemeUI.uiToken.colorSuccess,
    disabledColor: lightThemeUI.uiToken.colorError
  },
  ruleType: {
    border: `1px solid ${lightThemeBasic.basic.colorGrayLine}`,
    backgroundColor: lightThemeUI.uiToken.colorFillTertiary,
    color: lightThemeUI.uiToken.colorTextSecondary,
    activeBackgroundColor: lightThemeBasic.basic.colorPrimaryBgActive,
    activeColor: lightThemeUI.uiToken.colorPrimary,
    countActiveBackgroundColor: lightThemeBasic.basic.colorPrimaryBgHover,
    countBackgroundColor: lightThemeUI.uiToken.colorFillSecondary
  },
  ruleList: {
    border: `1px solid ${lightThemeBasic.basic.colorGrayLine}`,
    backgroundColor: lightThemeUI.uiToken.colorFillTertiary,
    hoverBackgroundColor: lightThemeUI.uiToken.colorFillQuaternary,
    hoverBorder: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    levelIconTextColor: lightThemeUI.uiToken.colorTextTertiary,
    endContentColor: lightThemeUI.uiToken.colorTextQuaternary,
    levelContent: {
      annotationColor: lightThemeUI.uiToken.colorTextTertiary,
      paramsColor: '#9f6be9',
      paramsBackgroundColor: '#9F6BE91A'
    }
  }
};

export default ruleComponentTheme;
