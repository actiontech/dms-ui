import { styled } from '@mui/material/styles';
import { Tree } from 'antd5';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';

export const OrderDetailAuditResultStyleWrapper = styled('section')<{
  noMarginTop: boolean;
}>`
  margin-top: ${({ noMarginTop }) => (noMarginTop ? '0' : '40px')};

  .audit-result-title {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 0 40px;

    &.no-padding {
      padding: 0;
    }
  }

  .${ANTD_PREFIX_STR}-space.audit-result-actions-wrap {
    .${ANTD_PREFIX_STR}-divider.audit-result-actions-divider {
      margin: 0;
      height: 28px;
    }
  }
`;

export const ScheduleTimeModelDescribeStyleWrapper = styled('div')`
  margin-bottom: 16px;
`;

export const DataSourceResultListStyleWrapper = styled('div')`
  padding: 0 40px;
  margin-bottom: 80px;

  &.data-source-result-scroll-infinite-list {
    margin-bottom: 0;
  }

  & .${ANTD_PREFIX_STR}-list-items .${ANTD_PREFIX_STR}-list-item {
    padding: 0;
  }

  &
    .data-source-result-list-pagination.result-list-pagination.${ANTD_PREFIX_STR}-pagination {
    justify-content: space-between;
    margin: 0 !important;
    padding: 16px 40px;
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.table.pagination.backgroundColor};
    border-top: ${({ theme }) =>
      theme.sharedTheme.components.table.pagination.border};
    position: fixed;
    z-index: 999;
    right: 0;
    bottom: 0;
    width: calc(100% - 220px);
    display: flex;

    &::before {
      content: '';
      flex: 1;
    }

    .${ANTD_PREFIX_STR}-pagination-total-text {
      color: ${({ theme }) =>
        theme.sharedTheme.components.table.pagination.total.color};
      order: -1;
    }
    .${ANTD_PREFIX_STR}-pagination-prev {
      margin-inline-end: 8px;
    }
    .${ANTD_PREFIX_STR}-pagination-item {
      margin-inline-end: 8px;

      &:hover {
        background-color: ${({ theme }) =>
          theme.sharedTheme.components.table.pagination.item
            .hoverBackgroundColor};
      }

      a {
        color: ${({ theme }) =>
          theme.sharedTheme.components.table.pagination.item.color};
      }
    }

    .${ANTD_PREFIX_STR}-pagination-item-active {
      border: ${({ theme }) =>
        theme.sharedTheme.components.table.pagination.item.activeBorder};
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.table.pagination.item
          .activeBackgroundColor};

      a {
        color: ${({ theme }) =>
          theme.sharedTheme.components.table.pagination.item.activeColor};
      }
    }

    .${ANTD_PREFIX_STR}-pagination-options {
      .${ANTD_PREFIX_STR}-pagination-options-size-changer {
        &:not(.${ANTD_PREFIX_STR}-select-focused) {
          .${ANTD_PREFIX_STR}-select-selector:hover {
            border: ${({ theme }) =>
              theme.sharedTheme.components.table.pagination.options
                .hoverBorder};
          }
        }

        .${ANTD_PREFIX_STR}-select-selector {
          height: 28px;
          line-height: 28px;
          padding: 0 8px;
          width: 96px;
          background-color: ${({ theme }) =>
            theme.sharedTheme.components.table.pagination.options
              .backgroundColor};
          border: ${({ theme }) =>
            theme.sharedTheme.components.table.pagination.options.border};
          box-shadow: ${({ theme }) =>
            theme.sharedTheme.components.table.pagination.options.boxShadow};

          .${ANTD_PREFIX_STR}-select-selection-item {
            padding-inline-start: 4px;
            padding-inline-end: 0;
            display: flex;
            align-items: center;
            color: ${({ theme }) =>
              theme.sharedTheme.components.table.pagination.options.itemColor};
          }

          .${ANTD_PREFIX_STR}-select-selection-search {
            input {
              height: 28px;
            }
          }
        }
      }
    }
  }
`;

export const DataSourceResultCardStyleWrapper = styled('div')`
  width: 100%;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  margin-bottom: 20px;

  & .result-card-header {
    height: 60px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;

    .number {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      margin-right: 0 12px 0 4px;
    }

    .result-card-status-wrap {
      display: flex;
      margin-left: 4px;

      .result-card-status-divider {
        height: 28px;
        margin: 0 12px 0 4px;
      }
    }
  }

  & .result-card-content {
    padding: 16px 20px;

    .result-card-content-options {
      display: flex;
    }

    .result-card-sql-wrap {
      margin-top: 8px;
      padding-bottom: 2px;
    }

    .code-line {
      height: 26px;
      line-height: 26px;

      .code-line-number {
        display: inline-block;
        width: 24px;
        text-align: center;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
        user-select: none;
      }
    }

    &
      .${ANTD_PREFIX_STR}-collapse.result-record-collapse
      .${ANTD_PREFIX_STR}-collapse-header {
      padding: 8px 0;

      .${ANTD_PREFIX_STR}-collapse-header-text {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
        font-weight: 500;
      }
    }
  }

  .result-card-footer {
    padding: 16px 20px;
    border-top: 1px solid
      ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
  }
`;

export const DataSourceAuditResultTreeStyleWrapper = styled(Tree)`
  &.${ANTD_PREFIX_STR}-tree {
    .${ANTD_PREFIX_STR}-tree-indent {
      display: none;
    }

    .${ANTD_PREFIX_STR}-tree-node-selected {
      background-color: transparent !important;
    }

    .${ANTD_PREFIX_STR}-tree-switcher
      .${ANTD_PREFIX_STR}-tree-switcher-leaf-line {
      &::before {
        border-right: 1px solid
          ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
      }

      &::after {
        border-bottom: 1px solid
          ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
        height: 20px;
      }
    }

    .${ANTD_PREFIX_STR}-tree-treenode.${ANTD_PREFIX_STR}-tree-treenode-leaf-last
      .${ANTD_PREFIX_STR}-tree-switcher-leaf-line:before {
      height: 20px !important;
    }

    .${ANTD_PREFIX_STR}-tree-switcher {
      display: flex;
      align-items: center;
      justify-content: center;

      .${ANTD_PREFIX_STR}-tree-switcher-icon {
        margin-bottom: 2px;
      }
    }

    .${ANTD_PREFIX_STR}-tree-treenode {
      height: 36px;
      padding: 0;
      line-height: 36px;

      .${ANTD_PREFIX_STR}-tree-node-content-wrapper {
        line-height: 36px;
      }
    }

    .audit-result-tree-title {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    }

    .audit-result-text-describe {
      margin-left: 12px;
    }
  }
`;

export const DataSourceResultDescribeStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  & .result-describe-input.${ANTD_PREFIX_STR}-input {
    border: none !important;
    box-shadow: none !important;
    padding-left: 0;
    caret-color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    margin: 0 8px;
    flex: 1;
    left: 0;
    font-size: 13px;
  }
`;

export const DataSourceResultSqlOptionsStyleWrapper = styled('div')<{
  active: boolean;
}>`
  cursor: pointer;
  padding: 0 12px;
  border-radius: 4px;
  background: ${({ active, theme }) =>
    active
      ? theme.sharedTheme.basic.colorPrimaryBgActive
      : theme.sharedTheme.basic.colorBgLayoutGray};
  height: 28px;
  line-height: 28px;
  color: ${({ active, theme }) =>
    active
      ? theme.sharedTheme.uiToken.colorPrimary
      : theme.sharedTheme.uiToken.colorTextTertiary};
  margin-right: 4px;
`;
