import { styled } from '@mui/material/styles';

export const ManagementViewStyleWrapper = styled('div')`
  .management-view-segmented.ant-segmented {
    .management-view-segmented-option {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      svg {
        width: 14px;
        height: 14px;
      }
    }

    .ant-segmented-item {
      background: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.ManagementView.segmented
          .defaultBgColor} !important;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.ManagementView.segmented
          .defaultTextColor} !important;

      .ant-segmented-item-label {
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.ManagementView.segmented
            .defaultTextColor} !important;
      }

      &:hover:not(.ant-segmented-item-selected):not(
          .ant-segmented-item-disabled
        ) {
        &::after {
          opacity: 0 !important;
        }
      }
    }

    .ant-segmented-item-selected {
      background: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.ManagementView.segmented
          .selectedBgColor} !important;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.ManagementView.segmented
          .selectedTextColor} !important;

      .ant-segmented-item-label {
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.ManagementView.segmented
            .selectedTextColor} !important;
      }

      &:hover {
        background: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.ManagementView.segmented
            .selectedBgColor} !important;
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.ManagementView.segmented
            .selectedTextColor} !important;

        .ant-segmented-item-label {
          color: ${({ theme }) =>
            theme.sqleTheme.reportStatistics.ManagementView.segmented
              .selectedTextColor} !important;
        }
      }
    }
  }

  .management-view-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .management-view-cards {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    /* 允许网格项按比例收缩，避免被内容 min-width 撑开 */
    & > * {
      min-width: 0;
    }

    .ant-card-body {
      padding-top: 24px !important;

      .card-header {
        border: none;
        margin-bottom: 14px;
      }
    }
  }
`;
