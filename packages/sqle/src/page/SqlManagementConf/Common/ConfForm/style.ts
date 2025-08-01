import { styled } from '@mui/material/styles';
import { Alert } from 'antd';

export const SqlManagementConfFormStyleWrapper = styled('section')`
  .ant-form-item-control-input-content {
    display: flex;
    justify-content: end;
  }
`;

export const ConfFormAlertStyleWrapper = styled(Alert)`
  &.ant-alert.ant-alert-info {
    margin-bottom: 12px;
  }
`;
