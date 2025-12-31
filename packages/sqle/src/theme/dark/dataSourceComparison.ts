import { darkThemeUI } from '@actiontech/dms-kit/es/theme/dark/basic';
import { DataSourceComparisonTheme } from '../type';

export const dataSourceComparisonTheme: DataSourceComparisonTheme = {
  comparisonResultDiffBackgroundColor: 'rgba(255, 77, 79, 0.2)',
  comparisonEntry: {
    card: {
      boxShadow:
        '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
      borderColor: darkThemeUI.uiToken.colorBorderSecondary
    },
    timeInfo: {
      color: darkThemeUI.uiToken.colorTextTertiary
    },
    overview: {
      card: {
        hoverBoxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        suggestion: {
          color: darkThemeUI.uiToken.colorTextTertiary
        },
        mode: {
          same: {
            borderColor: '#52c41a',
            color: '#52c41a',
            selectedBgColor: 'rgba(82, 196, 26, 0.2)'
          },
          inconsistent: {
            borderColor: '#faad14',
            color: '#faad14',
            selectedBgColor: 'rgba(250, 173, 20, 0.2)'
          },
          baseNotExist: {
            borderColor: '#2196f3',
            color: '#2196f3',
            selectedBgColor: 'rgba(33, 150, 243, 0.2)'
          },
          comparisonNotExist: {
            borderColor: '#ff4d4f',
            color: '#ff4d4f',
            selectedBgColor: 'rgba(255, 77, 79, 0.2)'
          }
        }
      }
    },
    treeNode: {
      title: {
        bgColor: darkThemeUI.uiToken.colorFillTertiary
      },
      node: {
        inconsistent: {
          color: '#f57c00',
          baselineBgColor: 'rgba(245, 124, 0, 0.2)',
          comparisonBgColor: 'rgba(245, 124, 0, 0.3)'
        },
        missing: {
          color: '#d32f2f',
          baselineBgColor: 'rgba(211, 47, 47, 0.2)',
          comparisonBgColor: 'rgba(211, 47, 47, 0.3)'
        },
        new: {
          color: '#2196f3',
          bgColor: 'rgba(33, 150, 243, 0.2)'
        },
        tag: {
          inconsistent: {
            color: '#f57c00',
            bgColor: 'rgba(245, 124, 0, 0.2)'
          },
          missing: {
            color: '#d32f2f',
            bgColor: 'rgba(211, 47, 47, 0.2)'
          },
          new: {
            color: '#2196f3',
            bgColor: 'rgba(33, 150, 243, 0.2)'
          }
        }
      }
    }
  }
};
