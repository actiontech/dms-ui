import { styled } from '@mui/material/styles';

export const RejectReasonStyleWrapper = styled('div')<{ isMobile?: boolean }>`
  margin: ${({ isMobile }) => (isMobile ? '1rem' : '40px')};
  padding: ${({ isMobile }) => (isMobile ? '1rem' : '24px')};
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};

  .reject-workflow-reason-content {
    margin: 0 16px 0 24px;
    flex: 1;

    &-text {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      width: 100%;

      &-reason {
        overflow-wrap: break-word;
      }
    }

    &-tips {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      margin-top: 4px;
    }
  }

  .wait-operator-modify-sql {
    overflow-wrap: break-word;
  }
`;
