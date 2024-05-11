import { styled } from '@mui/material/styles';
import { Tree } from 'antd';

export const OrderDetailAuditResultStyleWrapper = styled('section')`
  margin-top: 40px;

  .audit-result-title {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 0 40px;
  }

  .ant-space.audit-result-actions-wrap {
    margin-right: 12px;

    .ant-divider.audit-result-actions-divider {
      margin: 0;
      height: 28px;
    }
  }
`;

export const ScheduleTimeModelDescribeStyleWrapper = styled('div')`
  margin-bottom: 16px;
`;

export const TasksResultListStyleWrapper = styled('div')`
  padding: 0 40px;
  margin-bottom: 80px;

  &.file-mode-task-result-pagination-list,
  &.file-mode-task-result-infinite-list {
    margin-top: 20px;

    .file-mode-title {
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      margin-bottom: 28px;
    }
  }

  &.task-result-scroll-infinite-list {
    margin-bottom: 0;
  }

  & .ant-list-items .ant-list-item {
    padding: 0 !important;

    .ant-collapse .ant-collapse-item .ant-collapse-content {
      .ant-table.ant-table-ping-right:not(.ant-table-has-fix-right)
        > .ant-table-container::after {
        box-shadow: none;
      }
    }
  }

  & .task-result-pagination-list.ant-pagination {
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

    .ant-pagination-total-text {
      color: ${({ theme }) =>
        theme.sharedTheme.components.table.pagination.total.color};
      order: -1;
    }

    .ant-pagination-prev {
      margin-inline-end: 8px;
    }

    .ant-pagination-item {
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

    .ant-pagination-item-active {
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

    .ant-pagination-options {
      .ant-pagination-options-size-changer {
        &:not(.ant-select-focused) {
          .ant-select-selector:hover {
            border: ${({ theme }) =>
              theme.sharedTheme.components.table.pagination.options
                .hoverBorder};
          }
        }

        .ant-select-selector {
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

          .ant-select-selection-item {
            padding-inline-start: 4px;
            padding-inline-end: 0;
            display: flex;
            align-items: center;
            color: ${({ theme }) =>
              theme.sharedTheme.components.table.pagination.options.itemColor};
          }

          .ant-select-selection-search {
            input {
              height: 28px;
            }
          }
        }
      }
    }
  }
`;

export const TasksResultCardStyleWrapper = styled('div')`
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
      justify-content: space-between;
    }

    & .ant-collapse.result-record-collapse .ant-collapse-header {
      padding: 8px 0;

      .ant-collapse-header-text {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
        font-weight: 500;
      }
    }
  }

  .file-result-collapse-wrapper {
    .ant-collapse-header {
      align-items: center !important;
      padding: 0 0 0 12px !important;
    }

    .file-result-card-wrapper {
      cursor: pointer;

      .file-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-name {
          margin-left: 8px;
        }
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
  &.ant-tree {
    .ant-tree-indent {
      display: none;
    }

    .ant-tree-node-selected {
      background-color: transparent !important;
    }

    .ant-tree-switcher .ant-tree-switcher-leaf-line {
      &::before {
        border-right: 1px solid
          ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
      }

      &::after {
        border-bottom: 1px solid
          ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
      }
    }

    .ant-tree-switcher {
      display: flex;
      align-items: center;
      justify-content: center;

      .ant-tree-switcher-icon {
        margin-bottom: 2px;
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

  & .result-describe-input.ant-input {
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
