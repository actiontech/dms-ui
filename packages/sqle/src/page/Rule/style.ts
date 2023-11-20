import { styled } from '@mui/material/styles';

export const RuleListProjectFilterStyleWrapper = styled('div')`
  .project-flag-icon {
    color: ${({ theme }) =>
      theme.sqleTheme.order.createOrder.editForm.projectFlagIconColor};
    margin-right: 8px;
  }
`;
