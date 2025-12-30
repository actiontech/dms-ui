import {
  darkThemeBasic,
  darkThemeUI
} from '@actiontech/dms-kit/es/theme/dark/basic';
import { ExecWorkflowTheme } from '../type';

export const execWorkflowTheme: ExecWorkflowTheme = {
  list: {
    desc: {
      copyIconColor: darkThemeUI.uiToken.colorPrimary,
      hoverCopyIconBackgroundColor: darkThemeBasic.basic.colorPrimaryBgHover
    }
  },
  create: {
    auditResult: {
      auditResultDrawer: {
        numberColor: darkThemeUI.uiToken.colorPrimary
      },
      toggleButton: {
        borderColor: darkThemeBasic.basic.colorGrayLine,
        color: darkThemeUI.uiToken.colorTextSecondary,
        activeColor: darkThemeUI.uiToken.colorPrimary,
        bgColor: darkThemeUI.uiToken.colorFillTertiary,
        activeBgColor: darkThemeBasic.basic.colorPrimaryBgActive
      },
      download: {
        borderColor: darkThemeUI.uiToken.colorBorderSecondary,
        bgColor: darkThemeUI.uiToken.colorFillQuaternary,
        boxShadow: '0px 3px 12px 0px rgba(0, 0, 0, 0.4)',
        itemColor: darkThemeUI.uiToken.colorText,
        itemHoverColor: darkThemeUI.uiToken.colorFillTertiary,
        itemIconColor: darkThemeUI.uiToken.colorTextTertiary
      }
    },
    form: {
      baseInfoTitleIconColor: darkThemeUI.uiToken.colorTextQuaternary
    },
    editForm: {
      titleColor: darkThemeUI.uiToken.colorTextTertiary,
      projectFlagIconColor: darkThemeUI.uiToken.colorWarning
    }
  },
  steps: {
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.5)'
  },
  common: {
    basicInfo: {
      borderColor: darkThemeBasic.basic.colorGrayLine,
      bgColor: darkThemeUI.uiToken.colorFillQuaternary,
      titleColor: darkThemeUI.uiToken.colorText,
      descColor: darkThemeUI.uiToken.colorTextTertiary
    },
    auditResultFilter: {
      borderColor: darkThemeBasic.basic.colorGrayLine,
      bgColor: darkThemeUI.uiToken.colorFillQuaternary,
      auditResultInfo: {
        itemBgColor: darkThemeUI.uiToken.colorFillQuaternary,
        textColor: darkThemeUI.uiToken.colorTextTertiary,
        schemaValueColor: darkThemeUI.uiToken.colorTextTertiary
      },
      options: {
        bgColor: darkThemeUI.uiToken.colorFillTertiary,
        activeBgColor: darkThemeBasic.basic.colorPrimaryBgActive,
        textColor: darkThemeUI.uiToken.colorTextTertiary,
        textActiveColor: darkThemeUI.uiToken.colorPrimary,
        numColor: darkThemeUI.uiToken.colorTextSecondary,
        numActiveColor: darkThemeUI.uiToken.colorPrimary
      }
    }
  }
};
