import { styled } from '@mui/material';
import { Collapse } from 'antd';

export const RewrittenSqlCollapseStyleWrapper = styled(Collapse)`
  background: transparent !important;
  border: none !important;

  &.ant-collapse {
    & > .ant-collapse-item {
      border: none;
      margin-bottom: 16px;
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px
        ${({ theme }) => theme.sharedTheme.basic.colorShadowByWhite};
      border-bottom: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary} !important;

      &:last-child {
        margin-bottom: 0;
      }

      .ant-collapse-header {
        position: relative;
        padding: 16px 24px !important;
        background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
        border-bottom: 1px solid transparent;
        transition: all 0.3s ease;
        display: flex;
        align-items: center !important;
        height: 55px !important;

        &:hover {
          background: ${({ theme }) =>
            theme.sharedTheme.uiToken.colorFillSecondary};
        }

        .ant-collapse-expand-icon {
          width: 24px;
          height: 24px;
          margin-right: 12px;

          svg {
            width: 12px;
            height: 12px;
            transition: transform 0.3s ease;
            color: ${({ theme }) =>
              theme.sharedTheme.uiToken.colorTextSecondary};
          }
        }

        .ant-collapse-header-text {
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
          font-weight: 500;
          font-size: 14px;
        }
      }

      .ant-collapse-content {
        border-top: none;
        background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};

        .ant-collapse-content-box {
          padding: 20px 24px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
          font-size: 14px;
          line-height: 1.6;
        }
      }

      &.ant-collapse-item-active {
        box-shadow: 0 4px 12px
          ${({ theme }) => theme.sharedTheme.basic.colorShadowByWhite};

        .ant-collapse-header {
          border-bottom-color: ${({ theme }) =>
            theme.sharedTheme.uiToken.colorBorderSecondary};
        }
      }
    }
  }
`;

export const ModuleHeaderTitleStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-right: 8px;
  }

  .count {
    font-size: 14px;
    padding: 2px 8px;
    border-radius: 8px;
    min-width: 24px;
    text-align: center;
  }

  .optimized-count {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccessBgHover};
  }

  .remaining-count {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorWarningBgHover};
  }

  .business-count {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    background: ${({ theme }) => theme.sharedTheme.basic.colorPrimaryBgHover};
  }
`;
