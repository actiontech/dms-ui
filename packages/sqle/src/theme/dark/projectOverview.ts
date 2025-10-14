import {
  darkThemeBasic,
  darkThemeUI
} from '@actiontech/dms-kit/es/theme/dark/basic';
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
      pointer: darkThemeUI.uiToken.colorTextQuaternary,
      pin: {
        fill: darkThemeUI.uiToken.colorBgBase,
        stroke: darkThemeUI.uiToken.colorTextQuaternary
      }
    }
  },
  ScanTask: {
    bar: {
      fill: rectColorName.color2,
      bg: darkThemeUI.uiToken.colorFillTertiary,
      activeColor: darkThemeBasic.basic.colorPrimaryActive,
      label: {
        fill: '#dad9d9'
      },
      toolTip: {
        dotColor: rectColorName.color2
      }
    },
    detail: {
      stroke: darkThemeBasic.basic.colorWhite
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
