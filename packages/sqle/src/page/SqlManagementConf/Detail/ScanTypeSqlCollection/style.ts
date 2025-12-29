import { styled } from '@mui/material';
import { ActiontechTable } from '@actiontech/dms-kit/es/components/ActiontechTable';

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

export const ScanTypeSqlCollectionTableStyleWrapper = styled(ActiontechTable)<{
  isMultiLineFiltering: boolean;
}>`
  .ant-table-body {
    max-height: ${(isMultiLineFiltering) =>
      `calc(100vh - ${isMultiLineFiltering ? '278px' : '240px'}) !important`};
  }
`;
