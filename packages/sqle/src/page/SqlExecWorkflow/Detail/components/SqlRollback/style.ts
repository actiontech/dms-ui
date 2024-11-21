import { styled } from '@mui/material';

export const SqlRollbackTableStyleWrapper = styled('section')`
  & .ant-transfer.ant-transfer-customize-list .ant-transfer-list {
    border: none;

    &:first-of-type {
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      border-top: none;
      border-left: none;
    }

    &:last-of-type {
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      border-top: none;
      border-right: none;
    }

    .ant-transfer-list-header-selected {
      display: none;
    }

    .ant-transfer-list-header-title {
      text-align: start;
      padding: 0 28px;
    }

    & .ant-table-wrapper {
      padding-bottom: 0px;
    }

    & .ant-table-container .ant-table-body {
      max-height: calc(100vh - 250px) !important;
    }

    .ant-tag {
      width: max-content;
    }

    .audit-result-describe-column {
      max-width: 600px;
    }

    .actiontech-table-filter-container-namespace {
      padding: 0 !important;
      border: none !important;
    }
  }
`;
