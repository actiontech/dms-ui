import { styled } from '@mui/material/styles';

export const ApprovalProcessPreviewStyleWrapper = styled('div')`
  padding: 24px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

  .approval-process-title {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    margin-bottom: 16px;
  }

  .approval-process-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .approval-process-step {
    display: flex;
    align-items: flex-start;
    position: relative;
    padding-left: 32px;
    padding-bottom: 16px;

    &:last-child {
      padding-bottom: 0;

      .step-connector {
        display: none;
      }
    }

    .step-indicator {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      .step-dot {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .step-connector {
        width: 2px;
        flex: 1;
        min-height: 16px;
        background: ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
        margin-top: 4px;
      }
    }

    .step-content {
      flex: 1;
      padding: 4px 0 0 12px;

      .step-type-name {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
      }

      .step-assignee {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
        font-size: 13px;
        line-height: 20px;
        margin-top: 2px;
      }
    }
  }

  .approval-process-hint {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px dashed
      ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 12px;
    line-height: 20px;
  }
`;
