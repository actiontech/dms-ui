import { styled } from '@mui/material/styles';

export const NotificationDescriptionStyleWrapper = styled('span')`
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`;

export const NotificationMessageStyleWrapper = styled('span')`
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
`;
