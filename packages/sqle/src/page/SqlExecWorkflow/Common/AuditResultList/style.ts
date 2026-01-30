import { styled } from '@mui/material';

export const AuditResultForCreateWorkflowStyleWrapper = styled('section')`
  .audit-result-describe-column {
    max-width: 600px;
  }

  .audit-result-exec-sql-column,
  .audit-result-column {
    max-width: 500px;
    cursor: pointer;
  }

  .backup-policy-column {
    .ant-tag {
      width: max-content;
    }
  }

  .instance-segmented-label {
    display: flex;
    align-items: center;

    &-icon {
      display: flex;
      align-items: center;
      margin-left: 4px;
    }
  }

  &.mobile-audit-result-list {
    .audit-result-segmented-row {
      padding: 1rem;
    }

    .ant-pagination {
      width: 100% !important;
    }
  }
`;
