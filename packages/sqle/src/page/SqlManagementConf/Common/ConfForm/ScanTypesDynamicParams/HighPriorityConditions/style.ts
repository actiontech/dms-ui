import { BasicTag } from '@actiontech/dms-kit';
import { styled } from '@mui/material/styles';
export const HighPriorityConditionDescTagStyleWrapper = styled(BasicTag)`
  height: 36px !important;
  margin-right: 0 !important;

  & .basic-typography-ellipsis {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary} !important;
    max-width: 120px;
  }
`;
