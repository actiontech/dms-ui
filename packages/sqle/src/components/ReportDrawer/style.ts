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
        line-height: 28px;
        padding: 24px 24px 16px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      }

      .wrapper-cont {
        height: calc(100% - 68px);
        padding: 0 24px;
        overflow-y: auto;

        .result-item {
          background: ${({ theme }) =>
            theme.sharedTheme.uiToken.colorFillTertiary};
          border: 1px solid
            ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
          border-radius: 4px;
          padding: 8px 12px;
          margin-bottom: 4px;

          &:last-child {
            margin-bottom: 0;
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

export const AuditResultExceptionStyleWrapper = styled('div')`
  padding: 0 24px;

  .title {
    margin-bottom: 0;
    font-size: 14px !important;
    font-weight: 600;
    line-height: 28px;
    padding: 24px 0 16px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }

  .exception-item {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 4px;

    .exception-item-rule-desc-wrapper {
      display: flex;

      .exception-item-rule-desc-icon {
        width: 20px;
        height: 20px;
      }
      .exception-item-rule-desc-text {
        flex: 1;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
        margin-left: 12px;
        font-size: 13px;
        font-weight: 400;
        line-height: 20px;
      }
    }

    .exception-item-message-wrapper {
      width: 100%;
      margin-bottom: 0;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 12px;
      font-weight: 400;
      padding-left: 32px;
      margin-top: 8px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
