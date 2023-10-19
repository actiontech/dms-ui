import { AvatarCom } from '@actiontech/shared';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';

export const UserAvatarStyleWrapper = styled(AvatarCom)`
  &.work-flow-auth-avatar.${ANTD_PREFIX_STR}-avatar {
    border: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.userAvatarBorder};
    line-height: 20px;

    &:hover {
      transform: scale(1.33);
    }
  }
`;
