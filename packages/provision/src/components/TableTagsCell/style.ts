import { styled } from '@mui/material/styles';

export const TableTagsCellStyleWrapper = styled('div')`
  display: flex;

  .table-row-scan-types-more-button {
    width: 28px;
    height: 28px;
    box-shadow: none !important;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary} !important;
  }
`;
