import { styled } from '@mui/material/styles';

export const TableTaskTypeFilterStyleWrapper = styled('section')`
  padding: 14px 40px 4px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  display: flex;
  justify-content: space-between;
  align-items: center;

  .filter-btn {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;
