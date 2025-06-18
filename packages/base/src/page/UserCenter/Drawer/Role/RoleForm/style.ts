import { styled } from '@mui/material/styles';
import { Space, Alert } from 'antd';

export const RoleFormAlertStyleWrapper = styled(Alert)`
  &.ant-alert {
    margin-bottom: 12px !important;
  }
`;

export const OpPermissionCheckboxGroupStyleWrapper = styled(Space)<{
  isLast: boolean;
}>`
  &.ant-space {
    width: 100%;
    border-bottom: ${({ theme, isLast }) =>
      isLast
        ? 'none'
        : theme.sharedTheme.components.basicSelect.default.border};
    padding: 12px 0;

    .ant-checkbox-group {
      width: 100%;
      padding-left: 8px;

      .ant-checkbox-wrapper {
        width: 49%;
      }
    }
  }
`;
