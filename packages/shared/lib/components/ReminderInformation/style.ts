import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const ReminderInformationStyleWrapper = styled(Space)`
  &.ant-space.ant-space-horizontal {
    padding: 8px 0;
    display: flex;
  }

  .custom-icon {
    margin-top: 2px;
  }

  .ant-space-item .ant-typography pre {
    white-space: pre-wrap;
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-family: inherit;
    font-size: 13px;
  }
`;
