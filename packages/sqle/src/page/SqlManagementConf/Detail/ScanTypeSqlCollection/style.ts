import { styled } from '@mui/material/styles';

export const ScanTypeSqlCollectionStyleWrapper = styled('section')`
  .audit-result-wrapper {
    cursor: pointer;
    white-space: nowrap;

    .ant-space {
      display: inline-flex;
      flex-wrap: nowrap;
    }

    .ant-space-item,
    .audit-level-summary-item,
    .audit-level-summary-count {
      flex: none;
      white-space: nowrap;
    }
  }

  .table-describe-column {
    max-width: 600px;
  }

  .actiontech-table-namespace {
    .ant-table-thead > tr > th {
      white-space: nowrap;
      word-break: keep-all;
    }
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
`;
