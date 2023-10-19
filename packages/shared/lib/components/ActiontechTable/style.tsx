import { ANTD_PREFIX_STR } from '../../data/common';
import { ConfigProviderProps } from 'antd5/es/config-provider';
import { ACTIONTECH_TABLE_OPERATOR_COLUMN_CLS } from './hooks/useTableAction';
import { styled } from '@mui/material/styles';
import { Table } from 'antd5';

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
  &.${ANTD_PREFIX_STR}-table-wrapper.table-row-cursor {
    .${ANTD_PREFIX_STR}-table-tbody {
      tr {
        cursor: pointer;
      }
    }
  }
  &.${ANTD_PREFIX_STR}-table-wrapper.actiontech-table-namespace {
    padding-bottom: 60px;
    .${ANTD_PREFIX_STR}-table-thead {
      tr {
        .${ANTD_PREFIX_STR}-table-cell {
          color: ${({ theme }) =>
            theme.sharedTheme.components.table.thead.color};
          border-bottom: ${({ theme }) =>
            theme.sharedTheme.components.table.thead.border};
          padding: 0 16px;
          height: 40px;
          line-height: 20px;
        }

        .${ANTD_PREFIX_STR}-table-cell:first-of-type {
          padding-left: 40px;
        }

        .${ANTD_PREFIX_STR}-table-cell:last-of-type {
          padding-right: 40px;
        }
      }
    }

    .${ANTD_PREFIX_STR}-table-row {
      .${ANTD_PREFIX_STR}-table-cell {
        color: ${({ theme }) => theme.sharedTheme.components.table.row.color};
        border-bottom: ${({ theme }) =>
          theme.sharedTheme.components.table.row.border};
        padding: 16px;
        height: 20px;
        line-height: 20px;
      }

      .${ANTD_PREFIX_STR}-table-cell:first-of-type {
        padding-left: 40px;
      }

      .${ANTD_PREFIX_STR}-table-cell:last-of-type {
        padding-right: 40px;
      }

      .${ACTIONTECH_TABLE_OPERATOR_COLUMN_CLS} {
        padding: 16px 40px 16px 16px;
      }
    }

    .${ANTD_PREFIX_STR}-checkbox-wrapper {
      .${ANTD_PREFIX_STR}-checkbox {
        .${ANTD_PREFIX_STR}-checkbox-inner {
          width: 15px;
          height: 15px;
          border-radius: 3px;
        }
      }
    }

    .${ANTD_PREFIX_STR}-table-pagination {
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
                theme.sharedTheme.components.table.pagination.options
                  .itemColor};
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
  }

  &.${ANTD_PREFIX_STR}-table-wrapper.actiontech-table-namespace.clear-padding-bottom {
    padding-bottom: 0;
  }
`;
