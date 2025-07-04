import { styled } from '@mui/material/styles';
import { Avatar } from 'antd';

export const CustomAvatarStyleWrapper = styled(Avatar)`
  &.ant-avatar.action-avatar {
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.customAvatar.backgroundColor};
    color: ${({ theme }) => theme.sharedTheme.components.customAvatar.color};
  }
`;
