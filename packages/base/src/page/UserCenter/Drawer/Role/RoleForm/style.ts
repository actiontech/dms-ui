import { styled } from '@mui/material/styles';
import { Space, Alert } from 'antd';

export const RoleFormAlertStyleWrapper = styled(Alert)`
  &.ant-alert {
    margin-bottom: 12px !important;
  }
`;

export const OpPermissionCheckboxGroupStyleWrapper = styled(Space)`
  &.ant-space {
    width: 100%;
    border-bottom: ${({ theme }) =>
      theme.sharedTheme.components.basicSelect.default.border};
    padding: 12px 0;

    &.last-group {
      border-bottom: none;
    }

    .ant-checkbox-group {
      width: 100%;
      padding-left: 8px;

      .ant-checkbox-wrapper {
        width: 49%;
      }
    }
  }
`;
