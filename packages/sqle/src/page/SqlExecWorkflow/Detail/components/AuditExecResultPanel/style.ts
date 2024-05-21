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

  .ant-space.audit-result-actions-wrap {
    margin-right: 12px;

    .ant-divider.audit-result-actions-divider {
      margin: 0;
      height: 28px;
    }
  }
`;
