import { styled } from '@mui/material/styles';
import { Card, Pagination } from 'antd';

export const AuditResultStyleWrapper = styled('section')`
  height: 100%;
  border-left: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillQuaternary};
  position: relative;
  padding-bottom: 60px;
  width: 360px;

  .header-wrapper {
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-cont-text {
      margin-bottom: 0;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    }

    .refresh-icon {
      width: 28px;
      height: 28px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 16px;
      line-height: 28px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .audit-wrapper {
    height: calc(100% - 60px);

    .audit-cont {
      width: 100%;
      overflow-y: auto;
      padding: 0 24px;
    }
  }

  .audit-pagination {
    height: 60px;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 360px;
    border-top: 1px solid
      ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    border-left: 1px solid
      ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillQuaternary};
    padding-top: 20px;
  }
`;

export const PaginationStyleWrapper = styled(Pagination)`
  &.ant-pagination {
    display: flex;
    justify-content: center;

    .ant-pagination-item {
      &,
      a {
        color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorTextTertiary} !important;
      }

      &:hover,
      a:hover {
        color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorTextBase} !important;
      }
    }

    .ant-pagination-item-active {
      border-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorBorderSecondary} !important;
      background: ${({ theme }) =>
        theme.sharedTheme.basic.colorWhite} !important;

      &,
      a {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText} !important;
      }
    }
  }
`;

export const AuditItemStyleWrapper = styled(Card)`
  & {
    margin: 0 24px 16px !important;
  }

  .ant-card-body {
    background: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    padding: 20px 16px;

    &:hover {
      .audit-cont-text * {
        color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorPrimary} !important;
      }
    }

    p {
      margin-bottom: 0;
    }

    &,
    a {
      width: 100%;
    }

    .item-wrapper {
      display: flex;
    }

    .item-left {
      display: flex;
      align-items: center;
      flex: 1;

      .icon-status {
        width: 20px;
        margin-right: 16px;
      }

      .audit-cont-text {
        font-size: 13px;
        line-height: 20px;
        word-break: break-all;

        .time-text {
          font-weight: 600;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
        }

        .audit-desc {
          font-weight: 500;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
          margin-top: 2px;
        }
      }
    }

    .item-right {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;

      .audit-rate {
        width: 48px;
        height: 48px;
        text-align: center;
        line-height: 48px;
        border-radius: 50%;
        background: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorBorderSecondary};
        font-size: 16px;
        font-weight: 700;
      }
    }
  }

  &.status-success {
    .audit-rate {
      background: ${({ theme }) =>
        theme.sqleTheme.statistics.auditRateStatus.success.bg} !important;
      color: ${({ theme }) =>
        theme.sqleTheme.statistics.auditRateStatus.success.color} !important;
    }
  }

  &.status-warning {
    .audit-rate {
      background: ${({ theme }) =>
        theme.sqleTheme.statistics.auditRateStatus.warning.bg} !important;
      color: ${({ theme }) =>
        theme.sqleTheme.statistics.auditRateStatus.warning.color} !important;
    }
  }

  &.status-error {
    .audit-rate {
      background: ${({ theme }) =>
        theme.sqleTheme.statistics.auditRateStatus.error.bg} !important;
      color: ${({ theme }) =>
        theme.sqleTheme.statistics.auditRateStatus.error.color} !important;
    }
  }

  &.status-tip {
    .audit-rate {
      background: ${({ theme }) =>
        theme.sqleTheme.statistics.auditRateStatus.tip.bg} !important;
      color: ${({ theme }) =>
        theme.sqleTheme.statistics.auditRateStatus.tip.color} !important;
    }
  }
`;
