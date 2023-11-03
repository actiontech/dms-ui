import { styled } from '@mui/material/styles';

export const TestConnectResultStyleWrapper = styled('div')<{
  success: boolean;
}>`
  display: flex;
  height: 36px;
  align-items: center;
  color: ${({ theme, success }) =>
    success
      ? theme.sharedTheme.uiToken.colorSuccess
      : theme.sharedTheme.uiToken.colorError};
  font-size: 13px;

  .custom-icon {
    margin-right: 4px;
  }
`;

export const TestConnectDisableReasonStyleWrapper = styled('pre')`
  white-space: pre-wrap;
`;
