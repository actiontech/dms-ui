import { styled } from '@mui/material/styles';
import { Avatar } from 'antd';

/**
  todo: 字体头像的颜色
 */
export const AvatarStyleWrapper = styled(Avatar)`
  &.ant-avatar.action-avatar {
    /* background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryHover}; */
    background-color: #fde3cf;
    color: #f56a00;
  }
`;
