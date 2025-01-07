import { CustomAvatar } from '@actiontech/shared';

import { styled } from '@mui/material/styles';

export const UserAvatarStyleWrapper = styled(CustomAvatar)`
  &.work-flow-auth-avatar.ant-avatar {
    border: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.userAvatarBorder};
    line-height: 20px;

    &:hover {
      transform: scale(1.33);
    }
  }
`;
