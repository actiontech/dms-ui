import { ConfigProviderProps } from 'antd/es/config-provider';
import { ACTIONTECH_TABLE_OPERATOR_COLUMN_CLS } from './hooks/useTableAction';
import { styled } from '@mui/material/styles';
import { Table } from 'antd';

export const tableToken: ConfigProviderProps['theme'] = {
  token: {
    fontSize: 13,
    fontWeightStrong: 500
  },
  components: {
    Pagination: {
      itemSize: 28
    }
  }
};

export const ActiontechTableStyleWrapper = styled(Table)`
  &.ant-table-wrapper.table-row-cursor {
    .ant-table-tbody {
      tr {
        cursor: pointer;
      }
    }
  }
  &.ant-table-wrapper.actiontech-table-namespace {
    padding-bottom: 60px;
    .ant-table-thead {
      tr {
        .ant-table-cell {
          color: ${({ theme }) =>
            theme.sharedTheme.components.table.thead.color};
          border-bottom: ${({ theme }) =>
            theme.sharedTheme.components.table.thead.border};
          padding: 0 16px;
          height: 40px;
          line-height: 20px;
        }

        .ant-table-cell:first-of-type {
          padding-left: 40px;
        }

        .ant-table-cell:last-of-type {
          padding-right: 40px;
        }
      }
    }

    .ant-table-row {
      .ant-table-cell {
        color: ${({ theme }) => theme.sharedTheme.components.table.row.color};
        border-bottom: ${({ theme }) =>
          theme.sharedTheme.components.table.row.border};
        padding: 16px;
        height: 20px;
        line-height: 20px;
      }

      .ant-table-cell:first-of-type {
        padding-left: 40px;
      }

      .ant-table-cell:last-of-type {
        padding-right: 40px;
      }

      .${ACTIONTECH_TABLE_OPERATOR_COLUMN_CLS} {
        padding: 16px 40px 16px 16px;
      }
    }

    .ant-checkbox-wrapper {
      .ant-checkbox {
        .ant-checkbox-inner {
          width: 15px;
          height: 15px;
          border-radius: 3px;
        }
      }
    }

    .ant-table-pagination {
      justify-content: space-between;
      margin: 0 !important;
      padding: 16px 40px;
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.table.pagination.backgroundColor};

      &.actiontech-table-pagination-fixed {
        border-top: ${({ theme }) =>
          theme.sharedTheme.components.table.pagination.border};
        position: fixed;
        z-index: 999;
        right: 0;
        bottom: 0;
        width: calc(100% - 220px);
      }

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
                theme.sharedTheme.components.table.pagination.options
                  .itemColor};
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
  }

  &.ant-table-wrapper.actiontech-table-namespace.clear-padding-bottom {
    padding-bottom: 0;
  }
`;
