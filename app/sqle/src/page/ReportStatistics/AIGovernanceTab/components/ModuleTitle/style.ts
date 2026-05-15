import { styled } from '@mui/material/styles';

export const ModuleTitleStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  gap: ${({ theme }) =>
    `${theme.sqleTheme.reportStatistics.ModuleTitle.gap}px`};

  .module-title-icon {
    width: ${({ theme }) =>
      `${theme.sqleTheme.reportStatistics.ModuleTitle.iconSize}px`};
    height: ${({ theme }) =>
      `${theme.sqleTheme.reportStatistics.ModuleTitle.iconSize}px`};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .module-title-text {
    color: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.ModuleTitle.titleColor};
    font-size: ${({ theme }) =>
      `${theme.sqleTheme.reportStatistics.ModuleTitle.titleFontSize}px`};
    font-weight: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.ModuleTitle.titleFontWeight};
    line-height: 1.4;
  }

  .module-title-desc {
    color: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.ModuleTitle.descColor};
    font-size: ${({ theme }) =>
      `${theme.sqleTheme.reportStatistics.ModuleTitle.descFontSize}px`};
    border-radius: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.ModuleTitle.descBorderRadius};
    padding: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.ModuleTitle.descPadding};
    background-color: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.ModuleTitle.descBgColor};
    line-height: 1.4;
  }
`;
