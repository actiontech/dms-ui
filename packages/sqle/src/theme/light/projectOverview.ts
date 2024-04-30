import {
  lightThemeBasic,
  lightThemeUI
} from '@actiontech/shared/lib/theme/light/basic';
import { rectColorName } from './statistics';
import { ProjectOverviewTheme } from '../type';

export const projectOverviewTheme: ProjectOverviewTheme = {
  SqlCount: {
    baseColor: rectColorName.color10,
    grayColor: '#f2f1f0'
  },
  DataSourceCount: {
    health: rectColorName.color1,
    risk: rectColorName.color10
  },
  ProjectScore: {
    level: {
      dangerous: rectColorName.color11,
      warning: rectColorName.color10,
      good: rectColorName.color2,
      excellent: rectColorName.color5
    },
    indicator: {
      pointer: lightThemeUI.uiToken.colorTextQuaternary,
      pin: {
        fill: lightThemeUI.uiToken.colorBgBase,
        stroke: lightThemeUI.uiToken.colorTextQuaternary
      }
    }
  },
  ScanTask: {
    bar: {
      fill: rectColorName.color2,
      bg: lightThemeUI.uiToken.colorFillTertiary,
      activeColor: lightThemeBasic.basic.colorPrimaryActive,
      label: {
        fill: '#dad9d9'
      },
      toolTip: {
        dotColor: rectColorName.color2
      }
    },
    detail: {
      stroke: lightThemeBasic.basic.colorWhite
    }
  },
  DataSourcePerformance: {
    bar: {
      fill: rectColorName.color5,
      bg: 'rgba(0,0,0,0.1)'
    },
    toolTip: {
      dotColor: rectColorName.color5
    }
  }
};
