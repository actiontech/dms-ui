import { styled } from '@mui/material/styles';
import { Space, Typography } from 'antd';

export const UserStatusStyledWrapper = styled(Space)`
  .ant-space-item:first-of-type {
    display: flex;
  }
`;

export const UserCenterStyledWrapper = styled('section')`
  .user-center-table-desc-column {
    max-width: 200px;
  }
`;

export const UserDescStyledWrapper = styled(Typography.Paragraph)`
  max-width: 100%;

  &.ant-typography.ant-typography-ellipsis {
    margin-bottom: 0;
  }
`;
