import { styled } from '@mui/material';
import { Transfer } from 'antd';

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
      padding-bottom: 0;
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

export const MobileTableTransferStyleWrapper = styled(Transfer)`
  &.mobile-table-transfer {
    flex-direction: column;

    .ant-transfer-list-header {
      min-height: 2.5rem;
      height: auto !important;
    }

    .ant-transfer-operation {
      transform: rotate(90deg);
    }

    .ant-transfer-list-header-title {
      padding: 0 !important;
    }
  }
`;

export const SqlRollbackPageStyleWrapper = styled('div')`
  &.sql-rollback-page-style-wrapper .actiontech-page-header-namespace {
    padding: 0 1rem;
  }
`;
