import { darkThemeUI } from '@actiontech/shared/lib/theme/dark/basic';
import { KnowledgeTheme } from '../type';

export const knowledgeTheme: KnowledgeTheme = {
  highlight: {
    color: '#ff4d4f',
    background: '#ffebeb'
  },
  result: {
    list: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      hoverBoxShadow:
        '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
    },
    description: {
      borderLeftColor: darkThemeUI.uiToken.colorSuccess
    }
  },
  graph: {
    wrapper: {
      dotColor: '#f0f0f0',
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
      color: 'rgba(96, 96, 96, 0.6)'
    }
  }
};
