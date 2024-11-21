import { styled } from '@mui/material';

export const PermissionSelectorStyleWrapper = styled('div')`
  &.database-list-item {
    .wrapper {
      display: flex;
      align-items: start;
      gap: 12px;
    }

    .ant-form-item {
      margin-bottom: 16px !important;
    }

    .ant-form-item-label {
      padding: 0 !important;
    }

    .data-source-row-select-120 {
      width: 160px;
    }

    .data-source-row-select-220 {
      width: 210px;
    }

    .data-source-row-button {
      height: 36px !important;
      width: 36px !important;
    }

    .database-connection-info {
      min-height: 24px;
    }
  }
`;
