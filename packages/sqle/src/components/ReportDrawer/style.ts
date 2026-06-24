import { styled } from '@mui/material/styles';

export const AuditReportStyleWrapper = styled('div')`
  &.audit-report-wrapper {
    height: 100%;

    .wrapper-item {
      height: 34%;

      &.skipped-rule-wrapper {
        height: 28%;

        .wrapper-cont {
          height: calc(100% - 68px);
        }
      }

      h3 {
        margin-bottom: 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 28px;
        padding: 24px 24px 16px;
        color: #292c33;
      }

      .wrapper-cont {
        height: calc(100% - 68px);
        padding: 0 24px;
        overflow-y: auto;

        .result-item {
          background: #f7f6f4;
          border: 1px solid #f2f1f0;
          border-radius: 4px;
          padding: 8px 12px;
          margin-bottom: 4px;

          .rule-exception-action {
            display: flex;
            justify-content: flex-end;
            margin-top: 8px;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }

        .skipped-rule-item {
          background: ${({ theme }) =>
            theme.sharedTheme.uiToken.colorFillTertiary};
          border: 1px solid
            ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }

          .ant-descriptions-item-label,
          .ant-descriptions-item-content {
            padding-bottom: 8px;
          }
        }
      }

      .title-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 24px;

        .sql-source-title {
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
        }

        .sql-source-content {
          display: inline-flex !important;
          max-width: 200px;
        }
      }
    }
  }
`;
