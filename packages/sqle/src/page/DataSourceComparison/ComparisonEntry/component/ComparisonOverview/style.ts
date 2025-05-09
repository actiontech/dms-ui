import { styled } from '@mui/material/styles';
import { Card } from 'antd';

export const OverviewContainer = styled('div')`
  margin: 20px 0;
`;

export const OverviewCardStyleWrapper = styled(Card)`
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card
        .hoverBoxShadow};
  }

  &.selected {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card
        .hoverBoxShadow};
  }

  .stat-number {
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    margin: 16px 0;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .suggestion {
      color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card
          .suggestion.color};
    }
  }

  &.card-same-mode {
    border-top: 3px solid
      ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .same.borderColor} !important;

    .card-title,
    .stat-number {
      color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .same.color};
    }

    &.selected {
      background-color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .same.selectedBgColor};
    }
  }

  &.card-inconsistent-mode {
    border-top: 3px solid
      ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .inconsistent.borderColor} !important;

    .card-title,
    .stat-number {
      color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .inconsistent.color};
    }

    &.selected {
      background-color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .inconsistent.selectedBgColor};
    }
  }

  &.card-base-not-exist-mode {
    border-top: 3px solid
      ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .baseNotExist.borderColor} !important;

    .card-title,
    .stat-number {
      color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .baseNotExist.color};
    }

    &.selected {
      background-color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .baseNotExist.selectedBgColor};
    }
  }

  &.card-comparison-not-exist-mode {
    border-top: 3px solid
      ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .comparisonNotExist.borderColor} !important;

    .card-title,
    .stat-number {
      color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .comparisonNotExist.color};
    }

    &.selected {
      background-color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.overview.card.mode
          .comparisonNotExist.selectedBgColor};
    }
  }
`;
