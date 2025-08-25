import {
  darkThemeUI,
  darkThemeBasic
} from '@actiontech/dms-kit/es/theme/dark/basic';
import { GuidanceTheme } from '../type';

export const guidanceTheme: GuidanceTheme = {
  padding: 40,
  gap: 24,
  sceneSegmented: {
    backgroundColor: darkThemeUI.uiToken.colorBgBase,
    borderBottom: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`
  },
  steps: {
    icon: {
      width: 40,
      height: 40,
      backgroundColor: darkThemeUI.uiToken.colorPrimary
    },
    connection: {
      width: 2,
      gap: 8,
      backgroundColor: darkThemeUI.uiToken.colorBorderSecondary
    },
    step: {
      border: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
      title: {
        borderRight: `1px solid ${darkThemeUI.uiToken.colorBorderSecondary}`,
        index: {
          color: darkThemeUI.uiToken.colorPrimary
        },
        text: {
          color: darkThemeUI.uiToken.colorText
        }
      },
      content: {
        desc: {
          color: darkThemeUI.uiToken.colorTextTertiary
        }
      }
    }
  },
  guidanceButton: {
    default: {
      background: 'rgba(125, 140, 168, 0.10)',
      color: '#7D8CA8'
    },
    hover: {
      background: darkThemeBasic.basic.colorPrimaryBgActive,
      color: '#6094FC'
    }
  }
};
