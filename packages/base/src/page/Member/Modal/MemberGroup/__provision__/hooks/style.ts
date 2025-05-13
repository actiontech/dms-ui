import { styled } from '@mui/material';

export const CheckMemberGroupAuthErrorMessageStyleWrapper = styled('div')`
  max-height: 600px;
  overflow-y: auto;

  .auth-conflict-alert {
    margin-bottom: 16px !important;
  }

  .auth-conflict-user {
    margin-bottom: 24px;
    padding: 16px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    &:last-child {
      margin-bottom: 0;
    }
  }

  .auth-conflict-section {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .auth-conflict-title {
    font-weight: 500;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }

  .auth-conflict-divider {
    margin: 16px 0;
  }
`;
