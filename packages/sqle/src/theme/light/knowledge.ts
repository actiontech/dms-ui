import { lightThemeUI } from '@actiontech/dms-kit/es/theme/light/basic';
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
      borderLeftColor: lightThemeUI.uiToken.colorSuccess
    }
  },
  graph: {
    wrapper: {
      dotColor: '#f0f0f0',
      backgroundColor: 'transparent',
      borderColor: lightThemeUI.uiToken.colorBorderSecondary
    },
    container: {
      fullScreenBgColor: lightThemeUI.uiToken.colorBgBase
    },
    control: {
      borderColor: lightThemeUI.uiToken.colorBorderSecondary
    },
    edge: {
      color: '#ccc'
    }
  }
};
