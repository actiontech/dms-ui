import { WorkflowTemplateTheme } from '../type';
import { rectColorName } from './statistics';
import {
  lightThemeUI,
  lightThemeBasic
} from '@actiontech/dms-kit/es/theme/light/basic';
import { lightComponentsTheme } from '@actiontech/dms-kit/es/theme/light/components';

export const workflowTemplateTheme: WorkflowTemplateTheme = {
  progress: {
    normal: rectColorName.color9,
    notice: rectColorName.color2,
    warning: rectColorName.color10,
    error: rectColorName.color11,
    remainColor: lightThemeUI.uiToken.colorFill
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
    backgroundColor: lightThemeBasic.basic.colorWhite,
    disableBorder: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    disabledBackgroundColor: lightThemeUI.uiToken.colorFillQuaternary,
    disableHoverBackgroundColor: lightThemeUI.uiToken.colorFillTertiary,
    cardDesc: lightThemeUI.uiToken.colorTextTertiary,
    cardOperator: {
      borderTop: `1px solid ${lightThemeBasic.basic.colorGrayLine}`,
      titleColor: lightThemeUI.uiToken.colorTextTertiary
    },
    stepLineColor: lightThemeUI.uiToken.colorBorderSecondary,
    stepReviewIndexTextColor: lightThemeUI.uiToken.colorPrimary,
    closeButtonBoxShadow:
      lightComponentsTheme.table.row.moreButtonInActions.boxShadow,
    closeButtonFontSize: '12px',
    cardTitleFontWeight: 600,
    descFontSize: '13px',
    operatorTitleFontWeight: 500,
    stepReviewIndexTextFontWeight: 700,
    authTextColor: lightThemeUI.uiToken.colorSuccess
  },
  updateWorkflowTemplateStepInfo: {
    titleFontSize: '16px',
    titleFontWeight: 500,
    infoFontSize: '13px',
    title: {
      titleWrapperBorderBottom: lightThemeUI.uiToken.colorBorderSecondary,
      titleColor: lightThemeUI.uiToken.colorText,
      titleInfoColor: lightThemeUI.uiToken.colorTextTertiary
    },
    info: {
      titleColor: lightThemeUI.uiToken.colorText
    },
    stepInfoWrapper: {
      border: `1px dashed
      ${lightThemeUI.uiToken.colorBorderSecondary}`,
      backgroundColor: lightThemeUI.uiToken.colorFillQuaternary,
      textColor: lightThemeUI.uiToken.colorTextBase
    },
    stepNodeAlert: {
      backgroundColor: lightThemeUI.uiToken.colorFillTertiary,
      alertTitleColor: lightThemeUI.uiToken.colorTextTertiary,
      alertContentColor: lightThemeUI.uiToken.colorTextTertiary
    }
  },
  workflowTemplateAuthInfo: {
    topLevelFontWeight: 500,
    authLevelFontWeight: 600,
    authLevelFontSize: '18px',
    authInfoFontSize: '13px',
    borderBottom: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    authInfoColor: lightThemeUI.uiToken.colorTextTertiary
  }
};
