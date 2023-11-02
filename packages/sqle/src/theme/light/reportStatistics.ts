import {
  lightThemeBasic,
  lightThemeUI
} from '@actiontech/shared/lib/theme/light/basic';
import { ReportStatisticsTheme } from '../type';
import { rectColorName } from './statistics';

export const reportStatisticsTheme: ReportStatisticsTheme = {
  bgColor: lightThemeBasic.basic.colorBgLayoutGray,
  loadingColor: lightThemeUI.uiToken.colorPrimary,
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
  }
};
