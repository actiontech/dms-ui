import { SqleTheme } from '../../../types/theme.type';

const useGetConfig = (sqleTheme: SqleTheme) => {
  const getDomStyles = (width: number) => {
    return {
      'g2-tooltip': {
        width: `${width}px`,
        height: 'auto',
        borderRadius: '8px',
        background:
          sqleTheme.reportStatistics.DatabaseTypeOrder.tooltip.background,
        border: sqleTheme.reportStatistics.DatabaseTypeOrder.tooltip.border,
        boxShadow:
          sqleTheme.reportStatistics.DatabaseTypeOrder.tooltip.boxShadow,
        padding: '0 12px'
      }
    };
  };
  return {
    getDomStyles
  };
};

export default useGetConfig;
