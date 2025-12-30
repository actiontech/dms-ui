import {
  darkThemeBasic,
  darkThemeUI
} from '@actiontech/dms-kit/es/theme/dark/basic';
import { ReportStatisticsTheme } from '../type';
import { rectColorName } from './statistics';

export const reportStatisticsTheme: ReportStatisticsTheme = {
  bgColor: darkThemeBasic.basic.colorBgLayoutGray,
  loadingColor: darkThemeUI.uiToken.colorPrimary,
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
  }
};
