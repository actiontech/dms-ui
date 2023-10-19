import { styled } from '@mui/material/styles';

export const RejectReasonStyleWrapper = styled('div')`
  width: calc(100% - 80px);
  margin: 40px;
  padding: 24px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};

  .reject-order-reason-content {
    margin: 0 16px 0 24px;
    width: calc(100% - 280px);

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
    max-width: 200px;
    overflow-wrap: break-word;
  }
`;
