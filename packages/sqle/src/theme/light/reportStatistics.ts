import {
  lightThemeBasic,
  lightThemeUI
} from '@actiontech/dms-kit/es/theme/light/basic';
import { ReportStatisticsTheme } from '../type';
import { rectColorName } from './statistics';

export const reportStatisticsTheme: ReportStatisticsTheme = {
  bgColor: lightThemeBasic.basic.colorBgLayoutGray,
  loadingColor: lightThemeUI.uiToken.colorPrimary,
  AIGovernanceTab: {
    titleIconColor: '#7c3aed'
  },
  cardShow: {
    titleColor: lightThemeUI.uiToken.colorTextTertiary,
    iconColor: lightThemeUI.uiToken.colorPrimary,
    numberContColor: lightThemeUI.uiToken.colorText,
    noteColor: lightThemeBasic.basic.colorFontGrayByWhite,
    contentFontSize: 32,
    contentFontWeight: 700
  },
  CardWrapper: {
    titleColor: '#575C66',
    titleBorderColor: lightThemeUI.uiToken.colorBorderSecondary
  },
  TableTopList: {
    titleColor: lightThemeUI.uiToken.colorTextTertiary,
    noteTipColor: lightThemeBasic.basic.colorFontGrayByWhite,
    colorFillQuaternary: '#F2F1F0',
    bgColor: {
      toColor: '#ffffff00',
      line1: '#f54e7810',
      line2: '#8549e710',
      line3: '#308bf510'
    }
  },
  ChartContTitle: {
    mainColor: lightThemeUI.uiToken.colorTextBase,
    mainSubColor: '#C4C6C9',
    subContColor: lightThemeUI.uiToken.colorTextTertiary
  },
  DatabaseTypeOrder: {
    default: {
      fontSize: 16
    },
    tooltip: {
      background: '#fcfbf9',
      border: '1px solid #ebe9e8',
      boxShadow: '0 3px 12px 0 #332c1f1a'
    }
  },
  DatabaseSourceOrder: {
    default: {
      colorText: lightThemeUI.uiToken.colorText,
      colorTextTertiary: lightThemeUI.uiToken.colorTextTertiary
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
        columnBackground: '#F7F6F4',
        xAxis: lightThemeUI.uiToken.colorTextTertiary,
        yAxis: lightThemeBasic.basic.colorWhite,
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
      excellent: lightThemeUI.uiToken.colorSuccess,
      good: lightThemeUI.uiToken.colorInfo,
      normal: lightThemeUI.uiToken.colorTextTertiary,
      poor: lightThemeUI.uiToken.colorError,
      trailColor: lightThemeUI.uiToken.colorFill
    }
  },
  ManagementView: {
    segmented: {
      defaultBgColor: lightThemeBasic.basic.colorWhite,
      defaultTextColor: lightThemeUI.uiToken.colorTextBase,
      selectedBgColor: '#7c3aed',
      selectedTextColor: lightThemeBasic.basic.colorWhite
    },
    cardSectionTitle: {
      titleColor: '#1e293b',
      descColor: '#94a3b8'
    },
    topProblemDistribution: {
      barBackgroundColor: lightThemeUI.uiToken.colorFillTertiary,
      labelColor: lightThemeUI.uiToken.colorTextSecondary
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
      pending: lightThemeUI.uiToken.colorWarning,
      running: lightThemeUI.uiToken.colorInfo,
      completed: lightThemeUI.uiToken.colorSuccess,
      failed: lightThemeUI.uiToken.colorError
    }
  },
  StrategicInsight: {
    valueMilestoneBanner: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: lightThemeBasic.basic.colorWhite,
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
      securityDefense: lightThemeUI.uiToken.colorError,
      resourceCost: lightThemeUI.uiToken.colorSuccess,
      codeStandard: lightThemeUI.uiToken.colorInfo,
      rdEfficiency: '#a855f7',
      queryPerformance: lightThemeUI.uiToken.colorWarning
    }
  }
};
