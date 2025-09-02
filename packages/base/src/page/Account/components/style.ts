import { styled } from '@mui/material';

export const PrivacyModalTitleStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
  }

  .authorization-icon {
    background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryBgHover};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
  }

  .revocation-icon {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorError} !important;
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorErrorBgHover};
  }
`;
