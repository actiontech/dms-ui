import { styled } from '@mui/material';

export const ScanTypeSqlCollectionStyleWrapper = styled('section')`
  .table-describe-column {
    max-width: 600px;
  }

  .actiontech-table-filter-container-namespace {
    padding: 0;
    border: none;
  }

  .actiontech-table-toolbar-namespace {
    & > .ant-space-item:first-of-type {
      flex: 1;
    }
  }

  .audit-tag {
    width: fit-content;
  }
`;
