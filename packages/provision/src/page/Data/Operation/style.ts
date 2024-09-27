import { styled } from '@mui/material';

export const MergeTableRowStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: start;

  .custom-table-cell-item {
    padding-left: 16px;
    min-height: 60px;
  }

  .custom-table-cell-db-type-item {
    display: flex;
    align-items: center;
  }

  .custom-table-cell-item:not(:last-of-type) {
    border-bottom: ${({ theme }) =>
      theme.sharedTheme.components.table.thead.border};
  }
`;

export const OperationPageStyleWrapper = styled('section')`
  .ant-table-tbody {
    .ant-table-cell.custom-table-cell {
      padding: 0 !important;
    }
  }
`;
