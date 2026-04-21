import { styled } from '@mui/material/styles';

export const ApprovalProcessPreviewStyleWrapper = styled('div')`
  padding: 24px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

  .approval-process-title {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 16px;
  }

  .approval-process-step {
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillQuaternary};

    .approval-process-step-header {
      margin-bottom: 4px;

      .step-number {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
        font-weight: 500;
        font-size: 14px;
      }
    }

    .approval-process-step-assignee {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      font-size: 13px;
      line-height: 20px;
    }
  }

  .approval-process-hint {
    margin-top: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 13px;
    line-height: 20px;
  }
`;
