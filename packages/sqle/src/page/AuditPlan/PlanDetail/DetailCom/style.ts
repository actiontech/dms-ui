import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';

export const DetailComStyleWrapper = styled('section')`
  height: 100%;

  .header-wrapper {
    padding: 24px 40px;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      h3.header-cont-text {
        margin-bottom: 0;
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      }

      .refresh-icon {
        width: 28px;
        height: 28px;
        line-height: 28px;
        margin-left: 8px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
        display: flex;
        justify-content: center;
        align-items: center;
      }
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
            theme.sqleTheme.auditPlan.detail.tag.primary.background} !important;
          border-color: ${({ theme }) =>
            theme.sqleTheme.auditPlan.detail.tag.primary.background} !important;

          * {
            color: ${({ theme }) =>
              theme.sharedTheme.basic.colorPrimaryHover} !important;
          }
        }

        * {
          font-size: 13px;
          font-weight: 600;
          line-height: 20px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
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

  .detail-table-wrapper {
    height: 100%;
    position: relative;
    padding-bottom: 61px;

    .${ANTD_PREFIX_STR}-spin-nested-loading {
      width: 100%;
    }

    .actiontech-table-namespace,
    .${ANTD_PREFIX_STR}-spin-container,
      .${ANTD_PREFIX_STR}-spin-nested-loading {
      height: 100%;
    }

    .${ANTD_PREFIX_STR}-spin-container {
      position: relative;
    }

    .${ANTD_PREFIX_STR}-pagination {
      left: 220px !important;
      right: none !important;
      width: calc(100% - 220px - 360px) !important;
    }
  }
`;
