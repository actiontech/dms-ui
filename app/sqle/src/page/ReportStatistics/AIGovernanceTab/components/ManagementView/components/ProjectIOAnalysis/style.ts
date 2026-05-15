import { styled } from '@mui/material/styles';

export const ProjectIOAnalysisStyleWrapper = styled('div')`
  .project-name-cell {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .project-rank-badge {
    width: 24px;
    height: 24px;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    font-size: 12px;
    font-weight: 700;
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorTextQuaternary};

    &.is-top1 {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorWarning};
    }
  }

  .health-score-cell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;
  }

  .health-score-value {
    white-space: nowrap;
    display: inline-block;
    width: 40px;
  }

  .ant-table-wrapper.actiontech-table-namespace {
    padding-bottom: 0 !important;
  }
`;
