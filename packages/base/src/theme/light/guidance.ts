import {
  lightThemeUI,
  lightThemeBasic
} from '@actiontech/shared/lib/theme/light/basic';
import { GuidanceTheme } from '../type';

export const guidanceTheme: GuidanceTheme = {
  padding: 40,
  gap: 24,
  sceneSegmented: {
    backgroundColor: lightThemeUI.uiToken.colorBgBase,
    borderBottom: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`
  },
  steps: {
    icon: {
      width: 40,
      height: 40,
      backgroundColor: lightThemeUI.uiToken.colorPrimary
    },
    connection: {
      width: 2,
      gap: 8,
      backgroundColor: lightThemeUI.uiToken.colorBorderSecondary
    },
    step: {
      border: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
      title: {
        borderRight: `1px solid ${lightThemeUI.uiToken.colorBorderSecondary}`,
        index: {
          color: lightThemeUI.uiToken.colorPrimary
        },
        text: {
          color: lightThemeUI.uiToken.colorText
        }
      },
      content: {
        desc: {
          color: lightThemeUI.uiToken.colorTextTertiary
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
      background: lightThemeBasic.basic.colorPrimaryBgActive,
      color: '#6094FC'
    }
  }
};
