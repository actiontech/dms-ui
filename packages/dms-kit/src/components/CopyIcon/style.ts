import { styled } from '@mui/material/styles';

export const CopyIconStyleWrapper = styled('div')<{ copied: boolean }>`
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
  margin-left: 4px;
  color: ${({ theme, copied }) =>
    copied
      ? theme.sharedTheme.uiToken.colorSuccess
      : theme.sharedTheme.uiToken.colorPrimary};
`;
