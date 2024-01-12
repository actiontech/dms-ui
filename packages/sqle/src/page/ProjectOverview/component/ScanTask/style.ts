import { styled } from '@mui/material/styles';

export const ScanTaskStyleWrapper = styled('section')`
  width: 100%;
  height: 100%;

  .task-list-wrapper {
    height: 408px;
    border-bottom: ${({ theme }) =>
      `0.5px ${theme.sharedTheme.basic.colorGrayLine} solid`};
  }

  .task-detail-wrapper {
    .title {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      line-height: 20px;
      padding-top: 20px;
    }

    .chart-detail-wrapper {
      height: 200px;
    }
  }
`;
