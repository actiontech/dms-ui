import { styled } from '@mui/material/styles';

export const SqlFileStatementOverviewStyleWrapper = styled('section')`
  .page-title-wrapper {
    display: flex;
    align-items: center;

    .custom-icon {
      margin-right: 6px;
    }
  }

  .ant-space.audit-result-actions-wrap {
    margin-right: 12px;

    .ant-divider.audit-result-actions-divider {
      margin: 0;
      height: 28px;
    }
  }

  &.mobile-sql-file-statement-overview-style-wrapper {
    .actiontech-page-header-namespace {
      padding: 0 1rem;
    }

    .segmented-row-style-wrapper {
      flex-direction: column;
      padding: 1rem;

      .audit-result-filter-container-borderless {
        margin-bottom: 1rem;

        .custom-segmented-filter-wrapper {
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: -0.5rem;

          .custom-segmented-filter-item {
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            margin-right: 0.5rem;
          }
        }
      }
    }

    .ant-pagination {
      width: 100% !important;
    }
  }
`;
