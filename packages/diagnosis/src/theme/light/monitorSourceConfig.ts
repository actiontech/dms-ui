import {
  lightThemeUI,
  lightThemeBasic
} from '@actiontech/shared/lib/theme/light/basic';
import { MonitorSourceConfigTheme } from '../type';

export const monitorSourceConfigTheme: MonitorSourceConfigTheme = {
  headerWrapper: {
    borderBottom: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
    title: {
      fontSize: '24px',
      fontWeight: 600,
      color: lightThemeUI.uiToken.colorTextBase
    },
    refreshIcon: {
      color: lightThemeUI.uiToken.colorTextTertiary
    },
    tagWrapper: {
      fontSize: '13px',
      fontWeight: 600,
      color: lightThemeUI.uiToken.colorTextSecondary,

      tagItem: {
        border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
        backgroundColor: '#fff'
      },
      tagPrimary: {
        primaryColor: '#6094fc1a',
        hoverColor: lightThemeBasic.basic.colorPrimaryHover
      },
      icon: {
        backgroundColor: '#7453da1a'
      }
    }
  }
};
