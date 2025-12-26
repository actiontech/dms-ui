import { styled } from '@mui/material';

export const TasksResultListStyleWrapper = styled('div')`
  padding: 0 40px;
  margin-bottom: 80px;

  /* style for mobile */
  &.mobile-task-result-list {
    padding: 0 1rem 4rem;
    margin-bottom: 4rem !important;

    .task-result-pagination-list {
      width: 100% !important;
    }

    .file-mode-title {
      margin-bottom: 1rem !important;
    }
  }

  &.mobile-task-result-list.file-mode-task-result-pagination-list,
  &.mobile-task-result-list.file-mode-task-result-infinite-list {
    margin-bottom: 1rem !important;
  }
  /* end style for mobile */

  &.file-mode-task-result-pagination-list,
  &.file-mode-task-result-infinite-list {
    margin-top: 20px;

    .file-mode-title {
      margin-bottom: 24px;

      .file-mode-title-text {
        font-size: 14px;
        font-weight: 500;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
        margin-left: 6px;
      }
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
