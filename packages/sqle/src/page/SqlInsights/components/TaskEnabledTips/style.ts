import { styled } from '@mui/material/styles';

export const LinkTextStyleWrapper = styled('span')`
  cursor: pointer;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary} !important;

  &:hover {
    opacity: 0.8;
  }
`;
