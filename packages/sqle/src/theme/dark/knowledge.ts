import { darkThemeUI } from '@actiontech/dms-kit/es/theme/dark/basic';
import { KnowledgeTheme } from '../type';

export const knowledgeTheme: KnowledgeTheme = {
  highlight: {
    color: '#ff4d4f',
    background: 'rgba(255, 77, 79, 0.2)'
  },
  result: {
    list: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      hoverBoxShadow:
        '0 3px 6px -4px rgba(0, 0, 0, 0.5), 0 6px 16px 0 rgba(0, 0, 0, 0.4), 0 9px 28px 8px rgba(0, 0, 0, 0.3)'
    },
    description: {
      borderLeftColor: darkThemeUI.uiToken.colorSuccess
    }
  },
  graph: {
    wrapper: {
      dotColor: darkThemeUI.uiToken.colorTextTertiary,
      backgroundColor: 'transparent',
      borderColor: darkThemeUI.uiToken.colorBorderSecondary
    },
    container: {
      fullScreenBgColor: darkThemeUI.uiToken.colorBgBase
    },
    control: {
      borderColor: darkThemeUI.uiToken.colorBorderSecondary
    },
    edge: {
      color: darkThemeUI.uiToken.colorTextTertiary
    }
  }
};
