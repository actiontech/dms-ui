import { styled } from '@mui/material';

export const AuditExecResultPanelStyleWrapper = styled('section')`
  margin-top: 40px;

  .audit-result-title {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 0 40px;
  }

  .audit-result-segmented-row {
    padding: 14px 40px;
  }

  .ant-space.audit-result-actions-wrap {
    margin-right: 12px;

    .ant-divider.audit-result-actions-divider {
      margin: 0;
      height: 28px;
    }
  }

  &.mobile-audit-result-panel {
    margin-top: 2rem;

    .audit-result-title {
      padding: 0 1rem;
    }

    .audit-result-segmented-row {
      padding: 0 1rem 0.8rem;

      & > div {
        margin-top: 0.8rem;
        white-space: nowrap;
      }
    }

    .ant-space.audit-result-actions-wrap {
      margin-right: 0.2rem;
    }
  }
`;
