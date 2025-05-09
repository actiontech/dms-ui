import { DataSourceComparisonTheme } from '../type';

export const dataSourceComparisonTheme: DataSourceComparisonTheme = {
  comparisonResultDiffBackgroundColor: '#ffebe9',
  comparisonEntry: {
    card: {
      boxShadow:
        '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      borderColor: '#f0f0f0'
    },
    timeInfo: {
      color: '#8c8c8c'
    },
    overview: {
      card: {
        hoverBoxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        suggestion: {
          color: '#8c8c8c'
        },
        mode: {
          same: {
            borderColor: '#52c41a',
            color: '#52c41a',
            selectedBgColor: 'rgba(82, 196, 26, 0.05)'
          },
          inconsistent: {
            borderColor: '#faad14',
            color: '#faad14',
            selectedBgColor: 'rgba(250, 173, 20, 0.05)'
          },
          baseNotExist: {
            borderColor: '#2196f3',
            color: '#2196f3',
            selectedBgColor: 'rgba(33, 150, 243, 0.05)'
          },
          comparisonNotExist: {
            borderColor: '#ff4d4f',
            color: '#ff4d4f',
            selectedBgColor: 'rgba(255, 77, 79, 0.05)'
          }
        }
      }
    },
    treeNode: {
      title: {
        bgColor: '#f5f7fa'
      },
      node: {
        inconsistent: {
          color: '#f57c00',
          baselineBgColor: 'rgba(245, 124, 0, 0.05)',
          comparisonBgColor: 'rgba(245, 124, 0, 0.1)'
        },
        missing: {
          color: '#d32f2f',
          baselineBgColor: 'rgba(211, 47, 47, 0.05)',
          comparisonBgColor: 'rgba(211, 47, 47, 0.1)'
        },
        new: {
          color: '#2196f3',
          bgColor: 'rgba(33, 150, 243, 0.1)'
        },
        tag: {
          inconsistent: {
            color: '#f57c00',
            bgColor: 'rgba(245, 124, 0, 0.1)'
          },
          missing: {
            color: '#d32f2f',
            bgColor: 'rgba(211, 47, 47, 0.1)'
          },
          new: {
            color: '#2196f3',
            bgColor: 'rgba(33, 150, 243, 0.1)'
          }
        }
      }
    }
  }
};
