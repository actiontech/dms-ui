import {
  darkThemeBasic,
  darkThemeUI
} from '@actiontech/dms-kit/es/theme/dark/basic';
import { ReportStatisticsTheme } from '../type';
import { rectColorName } from './statistics';

export const reportStatisticsTheme: ReportStatisticsTheme = {
  bgColor: darkThemeBasic.basic.colorBgLayoutGray,
  loadingColor: darkThemeUI.uiToken.colorPrimary,
  AIGovernanceTab: {
    titleIconColor: '#7c3aed'
  },
  cardShow: {
    titleColor: darkThemeUI.uiToken.colorTextTertiary,
    iconColor: darkThemeUI.uiToken.colorPrimary,
    numberContColor: darkThemeUI.uiToken.colorText,
    noteColor: darkThemeBasic.basic.colorFontGrayByWhite,
    contentFontSize: 32,
    contentFontWeight: 700
  },
  CardWrapper: {
    titleColor: darkThemeUI.uiToken.colorTextSecondary,
    titleBorderColor: darkThemeUI.uiToken.colorBorderSecondary
  },
  TableTopList: {
    titleColor: darkThemeUI.uiToken.colorTextTertiary,
    noteTipColor: darkThemeBasic.basic.colorFontGrayByWhite,
    colorFillQuaternary: darkThemeUI.uiToken.colorFillSecondary,
    bgColor: {
      toColor: '#ffffff00',
      line1: '#f54e7810',
      line2: '#8549e710',
      line3: '#308bf510'
    }
  },
  ChartContTitle: {
    mainColor: darkThemeUI.uiToken.colorTextBase,
    mainSubColor: darkThemeUI.uiToken.colorTextSecondary,
    subContColor: darkThemeUI.uiToken.colorTextTertiary
  },
  DatabaseTypeOrder: {
    default: {
      fontSize: 16
    },
    tooltip: {
      background: darkThemeUI.uiToken.colorBgBase,
      border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
      boxShadow: '0 3px 12px 0 rgba(0, 0, 0, 0.4)'
    }
  },
  DatabaseSourceOrder: {
    default: {
      colorText: darkThemeUI.uiToken.colorText,
      colorTextTertiary: darkThemeUI.uiToken.colorTextTertiary
    }
  },
  LicenseStatistics: {
    ChartContTitle: {
      lineColor: rectColorName.color2
    },
    LicenseColumn: {
      defaultColor: rectColorName.color2,
      fillColor: {
        column: rectColorName.color2,
        columnBackground: darkThemeUI.uiToken.colorFillTertiary,
        xAxis: darkThemeUI.uiToken.colorTextTertiary,
        yAxis: darkThemeBasic.basic.colorWhite,
        state: {
          active: rectColorName.color2
        }
      }
    }
  },
  WorkOrderState: {
    ChartContTitle: {
      color: rectColorName.color5,
      noteSubColor: rectColorName.color5
    }
  },
  ModuleTitle: {
    gap: 5,
    iconSize: 24,
    titleColor: '#1e293b',
    titleFontSize: 18,
    titleFontWeight: 700,
    descColor: '#475569',
    descFontSize: 12,
    descBorderRadius: '9999px',
    descPadding: '2px 8px',
    descBgColor: '#e2e8f0'
  },
  ProjectIOAnalysis: {
    healthScore: {
      excellent: darkThemeUI.uiToken.colorSuccess,
      good: darkThemeUI.uiToken.colorInfo,
      normal: darkThemeUI.uiToken.colorTextTertiary,
      poor: darkThemeUI.uiToken.colorError,
      trailColor: darkThemeUI.uiToken.colorFill
    }
  },
  ManagementView: {
    segmented: {
      defaultBgColor: darkThemeBasic.basic.colorWhite,
      defaultTextColor: darkThemeUI.uiToken.colorTextBase,
      selectedBgColor: '#7c3aed',
      selectedTextColor: darkThemeBasic.basic.colorWhite
    },
    cardSectionTitle: {
      titleColor: '#1e293b',
      descColor: '#94a3b8'
    },
    topProblemDistribution: {
      barBackgroundColor: darkThemeUI.uiToken.colorFillTertiary,
      labelColor: darkThemeUI.uiToken.colorTextSecondary
    }
  },
  ExecutionData: {
    functionModuleTag: {
      smartCorrection: {
        color: '#6d28d9',
        bgColor: '#f5f3ff'
      },
      performanceEngine: {
        color: '#1d4ed8',
        bgColor: '#dbeafe'
      }
    },
    processStatus: {
      pending: darkThemeUI.uiToken.colorWarning,
      running: darkThemeUI.uiToken.colorInfo,
      completed: darkThemeUI.uiToken.colorSuccess,
      failed: darkThemeUI.uiToken.colorError
    }
  },
  StrategicInsight: {
    valueMilestoneBanner: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: darkThemeBasic.basic.colorWhite,
      bgIconColor: 'rgba(255, 255, 255, 0.16)',
      iconCircleBgColor: 'rgba(255, 255, 255, 0.2)',
      headerIconColor: '#fde047',
      descriptionColor: 'rgba(255, 255, 255, 0.9)'
    },
    efficiencyCard: {
      titleColor: '#64748b',
      evaluationColor: '#1e293b',
      valueColor: '#334155',
      businessValueColor: '#94a3b8'
    },
    efficiencyCardEvaluationLine: {
      securityDefense: darkThemeUI.uiToken.colorError,
      resourceCost: darkThemeUI.uiToken.colorSuccess,
      codeStandard: darkThemeUI.uiToken.colorInfo,
      rdEfficiency: '#a855f7',
      queryPerformance: darkThemeUI.uiToken.colorWarning
    }
  }
};
