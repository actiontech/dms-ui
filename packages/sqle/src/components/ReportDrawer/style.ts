import { styled } from '@mui/material/styles';

export const AuditReportStyleWrapper = styled('div')`
  &.audit-report-wrapper {
    height: 100%;

    .wrapper-item {
      height: 50%;

      h3 {
        margin-bottom: 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 22px;
        padding: 24px 24px 16px;
        color: #292c33;
      }

      .wrapper-cont {
        height: calc(100% - 62px);
        padding: 0 24px;
        overflow-y: auto;

        .result-item {
          background: #f7f6f4;
          border: 1px solid #f2f1f0;
          border-radius: 4px;
          padding: 8px 12px;
          margin-bottom: 4px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
`;
