import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Space, Typography } from 'antd5';

export const UserStatusStyledWrapper = styled(Space)`
  .${ANTD_PREFIX_STR}-space-item:first-of-type {
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
  &.${ANTD_PREFIX_STR}-typography.${ANTD_PREFIX_STR}-typography-ellipsis {
    margin-bottom: 0;
  }
`;
