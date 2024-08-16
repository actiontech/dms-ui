import { BasicTag } from '@actiontech/shared';
import { styled } from '@mui/material/styles';

export const HighPriorityConditionDescTagStyleWrapper = styled(BasicTag)`
  height: 36px !important;
  & .basic-typography-ellipsis {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary} !important;
    max-width: 90px;
  }
`;
