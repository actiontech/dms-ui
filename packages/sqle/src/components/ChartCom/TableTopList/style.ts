import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';

export const TableTopListStyleWrapper = styled('div')`
  &.report-base-table-wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    table > thead > tr > th[scope='col'],
    thead > tr > th span {
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.TableTopList.titleColor};
    }

    .no-table-data-style,
    .no-table-data-style
      .${ANTD_PREFIX_STR}-spin-nested-loading,
      .no-table-data-style
      .${ANTD_PREFIX_STR}-spin-container,
      .no-table-data-style
      .${ANTD_PREFIX_STR}-table,
      .no-table-data-style
      .${ANTD_PREFIX_STR}-table-container,
      .no-table-data-style
      .${ANTD_PREFIX_STR}-table-content,
      .no-table-data-style
      table {
      height: 100%;
    }

    .has-table-cont-style {
      tbody {
        > tr {
          &:nth-of-type(1) {
            background: ${({ theme }) =>
              `linear-gradient(90deg, ${theme.sqleTheme.reportStatistics.TableTopList.bgColor.line1} 10%, ${theme.sqleTheme.reportStatistics.TableTopList.bgColor.toColor} 100%)`};
          }

          &:nth-of-type(2) {
            background: ${({ theme }) =>
              `linear-gradient(90deg, ${theme.sqleTheme.reportStatistics.TableTopList.bgColor.line2} 10%, ${theme.sqleTheme.reportStatistics.TableTopList.bgColor.toColor} 100%)`};
          }

          &:nth-of-type(3) {
            background: ${({ theme }) =>
              `linear-gradient(90deg, ${theme.sqleTheme.reportStatistics.TableTopList.bgColor.line3} 10%, ${theme.sqleTheme.reportStatistics.TableTopList.bgColor.toColor} 100%)`};
          }
        }
      }
    }

    .data-bottom-tip {
      height: 56px;
      line-height: 56px;
      font-size: 14px;
      text-align: center;
      user-select: none;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.TableTopList.noteTipColor};
    }

    .report-base-table {
      table {
        border-collapse: separate;
        border-spacing: 0 2px;
      }

      & tr:last-child td {
        border-bottom-width: 0;
      }

      &.has-table-cont-style {
        & tr:last-child td {
          border-bottom-width: 1px;
        }
      }

      thead.${ANTD_PREFIX_STR}-table-thead > tr {
        > th.${ANTD_PREFIX_STR}-table-cell {
          height: 40px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 400;
          background: none;
          border: none;

          &:not([colspan]):not(:last-child)::before {
            width: 0;
            background-color: transparent;
          }
        }

        &:first-of-type > *:last-child {
          text-align: right;
        }
      }

      tbody.${ANTD_PREFIX_STR}-table-tbody {
        > tr {
          margin: 10px 0;

          > td.${ANTD_PREFIX_STR}-table-cell {
            height: 52px;
            padding: 0 16px;
            font-size: 14px;

            &:first-of-type {
              border-radius: 4px 0 0 4px;
            }

            &:last-child {
              border-radius: 0 4px 4px 0;
            }
          }

          > td:first-of-type {
            border-radius: 4px 0 0 4px;
          }

          > td:last-child {
            border-radius: 0 4px 4px 0;
          }
        }
      }
    }
  }
`;
