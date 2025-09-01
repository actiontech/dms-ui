import { RuleComponentTheme } from '../../theme.type';
import { darkThemeBasic, darkThemeUI } from '../basic';

const ruleComponentTheme: RuleComponentTheme = {
  ruleStatus: {
    enableColor: darkThemeUI.uiToken.colorSuccess,
    disabledColor: darkThemeUI.uiToken.colorError
  },
  ruleType: {
    border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
    backgroundColor: darkThemeUI.uiToken.colorFillTertiary,
    color: darkThemeUI.uiToken.colorTextSecondary,
    activeBackgroundColor: darkThemeBasic.basic.colorPrimaryBgHover,
    activeColor: darkThemeUI.uiToken.colorPrimary,
    countActiveBackgroundColor: darkThemeBasic.basic.colorPrimaryBgHover,
    countBackgroundColor: darkThemeUI.uiToken.colorFillSecondary
  },
  ruleList: {
    border: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
    backgroundColor: darkThemeUI.uiToken.colorFillTertiary,
    hoverBackgroundColor: darkThemeUI.uiToken.colorFillQuaternary,
    hoverBorder: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    levelIconTextColor: darkThemeUI.uiToken.colorTextTertiary,
    endContentColor: darkThemeUI.uiToken.colorTextQuaternary,
    levelContent: {
      annotationColor: darkThemeUI.uiToken.colorTextTertiary,
      paramsColor: '#9F6BE9',
      paramsBackgroundColor: '#9F6BE91A'
    }
  }
};

export default ruleComponentTheme;
