import {
  darkThemeBasic,
  darkThemeUI
} from '@actiontech/shared/lib/theme/dark/basic';
import { MonitorSourceConfigTheme } from '../type';

export const monitorSourceConfigTheme: MonitorSourceConfigTheme = {
  headerWrapper: {
    borderBottom: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
    title: {
      fontSize: '24px',
      fontWeight: 600,
      color: darkThemeUI.uiToken.colorTextBase
    },
    refreshIcon: {
      color: darkThemeUI.uiToken.colorTextTertiary
    },
    tagWrapper: {
      fontSize: '13px',
      fontWeight: 600,
      color: darkThemeUI.uiToken.colorTextSecondary,

      tagItem: {
        border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
        backgroundColor: '#fff'
      },
      tagPrimary: {
        primaryColor: '#6094fc1a',
        hoverColor: darkThemeBasic.basic.colorPrimaryHover
      },
      icon: {
        backgroundColor: '#7453da1a'
      }
    }
  }
};
