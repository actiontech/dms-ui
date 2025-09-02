import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const UserSelectOptionLabelStyleWrapper = styled(Space)`
  &.ant-space.ant-space-horizontal {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .ant-space-item:first-of-type {
    display: flex;
  }
`;
