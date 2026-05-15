import { styled } from '@mui/material/styles';

export const ColumnIndexStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  .index-box {
    font-size: 14px;
    width: 28px;
    text-align: left;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
  }
`;
