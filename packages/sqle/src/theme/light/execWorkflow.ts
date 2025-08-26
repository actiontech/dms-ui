import {
  lightThemeBasic,
  lightThemeUI
} from '@actiontech/dms-kit/es/theme/light/basic';
import { ExecWorkflowTheme } from '../type';

export const execWorkflowTheme: ExecWorkflowTheme = {
  list: {
    desc: {
      copyIconColor: lightThemeUI.uiToken.colorPrimary,
      hoverCopyIconBackgroundColor: lightThemeBasic.basic.colorPrimaryBgHover
    }
  },
  create: {
    auditResult: {
      auditResultDrawer: {
        numberColor: lightThemeUI.uiToken.colorPrimary
      },
      toggleButton: {
        borderColor: lightThemeBasic.basic.colorGrayLine,
        color: lightThemeUI.uiToken.colorTextSecondary,
        activeColor: lightThemeUI.uiToken.colorPrimary,
        bgColor: lightThemeUI.uiToken.colorFillTertiary,
        activeBgColor: lightThemeBasic.basic.colorPrimaryBgActive
      },
      download: {
        borderColor: lightThemeUI.uiToken.colorBorderSecondary,
        bgColor: lightThemeUI.uiToken.colorFillQuaternary,
        boxShadow: '0px 3px 12px 0px rgba(51, 44, 31, 0.1)',
        itemColor: lightThemeUI.uiToken.colorText,
        itemHoverColor: lightThemeUI.uiToken.colorFillTertiary,
        itemIconColor: lightThemeUI.uiToken.colorTextTertiary
      }
    },
    form: {
      baseInfoTitleIconColor: lightThemeUI.uiToken.colorTextQuaternary
    },
    editForm: {
      titleColor: lightThemeUI.uiToken.colorTextTertiary,
      projectFlagIconColor: '#ebad1c'
    }
  },
  steps: {
    boxShadow: '0px 1px 4px 0px rgba(51, 44, 31, 0.12)'
  },
  common: {
    basicInfo: {
      borderColor: lightThemeBasic.basic.colorGrayLine,
      bgColor: lightThemeUI.uiToken.colorFillQuaternary,
      titleColor: lightThemeUI.uiToken.colorText,
      descColor: lightThemeUI.uiToken.colorTextTertiary
    },
    auditResultFilter: {
      borderColor: lightThemeBasic.basic.colorGrayLine,
      bgColor: lightThemeUI.uiToken.colorFillQuaternary,
      auditResultInfo: {
        itemBgColor: lightThemeUI.uiToken.colorFillQuaternary,
        textColor: lightThemeUI.uiToken.colorTextTertiary,
        schemaValueColor: '#7d8ca8'
      },
      options: {
        bgColor: lightThemeUI.uiToken.colorFillTertiary,
        activeBgColor: lightThemeBasic.basic.colorPrimaryBgActive,
        textColor: lightThemeUI.uiToken.colorTextTertiary,
        textActiveColor: lightThemeUI.uiToken.colorPrimary,
        numColor: lightThemeUI.uiToken.colorTextSecondary,
        numActiveColor: lightThemeUI.uiToken.colorPrimary
      }
    }
  }
};
