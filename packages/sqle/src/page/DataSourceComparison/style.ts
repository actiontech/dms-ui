import { styled } from '@mui/material/styles';

export const DataSourceComparisonStyleWrapper = styled('section')`
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorFillTertiary};

  &.has-min-height {
    min-height: 100%;
  }
`;
