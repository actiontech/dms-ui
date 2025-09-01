import {
  darkThemeBasic,
  darkThemeUI
} from '@actiontech/dms-kit/es/theme/dark/basic';
import { WorkflowTemplateTheme } from '../type';
import { rectColorName } from './statistics';
import { darkComponentsTheme } from '@actiontech/dms-kit/es/theme/dark/components';

export const workflowTemplateTheme: WorkflowTemplateTheme = {
  progress: {
    normal: rectColorName.color9,
    notice: rectColorName.color2,
    warning: rectColorName.color10,
    error: rectColorName.color11,
    remainColor: darkThemeUI.uiToken.colorFill
  },
  step: {
    honour: rectColorName.color10,
    addFile: rectColorName.color6,
    audit: rectColorName.color2,
    sendPlane: rectColorName.color13
  },
  stepCard: {
    userAvatarBorder: '2px solid #ffffff',
    boxShadow: '0px 1px 4px 0px rgba(51, 44, 31, 0.12)',
    hoverBoxShadow: '0px 3px 12px 0px rgba(51, 44, 31, 0.1)',
    backgroundColor: darkThemeBasic.basic.colorWhite,
    disableBorder: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    disabledBackgroundColor: darkThemeUI.uiToken.colorFillQuaternary,
    disableHoverBackgroundColor: darkThemeUI.uiToken.colorFillTertiary,
    cardDesc: darkThemeUI.uiToken.colorTextTertiary,
    cardOperator: {
      borderTop: `1px solid ${darkThemeBasic.basic.colorGrayLine}`,
      titleColor: darkThemeUI.uiToken.colorTextTertiary
    },
    stepLineColor: darkThemeUI.uiToken.colorBorderSecondary,
    stepReviewIndexTextColor: darkThemeUI.uiToken.colorPrimary,
    closeButtonBoxShadow:
      darkComponentsTheme.table.row.moreButtonInActions.boxShadow,
    closeButtonFontSize: '12px',
    cardTitleFontWeight: 600,
    descFontSize: '13px',
    operatorTitleFontWeight: 500,
    stepReviewIndexTextFontWeight: 700,
    authTextColor: darkThemeUI.uiToken.colorSuccess
  },
  updateWorkflowTemplateStepInfo: {
    titleFontSize: '16px',
    titleFontWeight: 500,
    infoFontSize: '13px',
    title: {
      titleWrapperBorderBottom: darkThemeUI.uiToken.colorBorderSecondary,
      titleColor: darkThemeUI.uiToken.colorText,
      titleInfoColor: darkThemeUI.uiToken.colorTextTertiary
    },
    info: {
      titleColor: darkThemeUI.uiToken.colorText
    },
    stepInfoWrapper: {
      border: `1px dashed
      ${darkThemeUI.uiToken.colorBorderSecondary}`,
      backgroundColor: darkThemeUI.uiToken.colorFillQuaternary,
      textColor: darkThemeUI.uiToken.colorTextBase
    },
    stepNodeAlert: {
      backgroundColor: darkThemeUI.uiToken.colorFillTertiary,
      alertTitleColor: darkThemeUI.uiToken.colorTextTertiary,
      alertContentColor: darkThemeUI.uiToken.colorTextTertiary
    }
  },
  workflowTemplateAuthInfo: {
    topLevelFontWeight: 500,
    authLevelFontWeight: 600,
    authLevelFontSize: '18px',
    authInfoFontSize: '13px',
    borderBottom: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    authInfoColor: darkThemeUI.uiToken.colorTextTertiary
  }
};
