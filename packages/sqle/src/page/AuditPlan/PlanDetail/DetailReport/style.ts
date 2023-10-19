import { styled } from '@mui/material/styles';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';

export const DetailReportStyleWrapper = styled('section')`
  padding-top: 60px;

  .header-wrapper {
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    padding: 24px 40px;
    display: flex;
    justify-content: space-between;

    .left-header {
      flex: auto;

      .header-cont-text {
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
        margin-bottom: 12px;
      }

      .tag-wrapper {
        display: flex;
        align-items: center;

        .custom-tag-item {
          display: flex;
          align-items: center;
          height: 28px;
          padding: 0 8px 0 6px;
          border-radius: 4px;
          border: 1px solid
            ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
          margin-right: 8px;

          &.custom-tag-primary {
            background-color: ${({ theme }) =>
              theme.sqleTheme.auditPlan.detail.tag.primary
                .background} !important;
            border-color: ${({ theme }) =>
              theme.sqleTheme.auditPlan.detail.tag.primary
                .background} !important;
            cursor: pointer;

            * {
              color: ${({ theme }) =>
                theme.sharedTheme.basic.colorPrimaryHover} !important;
            }
          }

          * {
            font-size: 13px;
            font-weight: 600;
            line-height: 20px;
            color: ${({ theme }) =>
              theme.sharedTheme.uiToken.colorTextSecondary};
          }

          .custom-icon {
            display: flex;
            justify-content: center;
            align-items: center;

            &.custom-tag-icon {
              width: 20px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              border-radius: 3px;
              margin-right: 6px;
            }

            &.bookmark-icon {
              background: ${({ theme }) =>
                theme.sqleTheme.auditPlan.detail.tag.icon.color};
            }

            &.custom-tag-right-icon {
              margin-right: 0;
              margin-left: 6px;
            }

            &.cursor-pointer {
              cursor: pointer;
            }
          }
        }
      }
    }

    .right-header {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 250px;

      .score-item {
        > div {
          text-align: center;
        }

        .score-text {
          font-size: 24px;
          font-weight: 700;
          line-height: 32px;
          margin-bottom: 4px;
        }

        .score-desc {
          font-weight: 400;
          line-height: 20px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
        }
      }

      .line {
        width: 1px;
        height: 40px;
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorBorderSecondary};
        margin: 0 24px;
      }

      .status-success {
        .score-text {
          color: ${({ theme }) =>
            theme.sqleTheme.statistics.auditRateStatus.success
              .color} !important;
        }
      }

      .status-warning {
        .score-text {
          color: ${({ theme }) =>
            theme.sqleTheme.statistics.auditRateStatus.warning
              .color} !important;
        }
      }

      .status-error {
        .score-text {
          color: ${({ theme }) =>
            theme.sqleTheme.statistics.auditRateStatus.error.color} !important;
        }
      }

      .status-tip {
        .score-text {
          color: ${({ theme }) =>
            theme.sqleTheme.statistics.auditRateStatus.tip.color} !important;
        }
      }
    }
  }

  .${ANTD_PREFIX_STR}-table-wrapper {
    padding-bottom: 62px;

    .sql-cont-width {
      height: 24px;
      overflow: hidden;
    }
  }
`;
