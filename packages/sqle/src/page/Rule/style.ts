import { styled } from '@mui/material/styles';

export const RuleListProjectFilterStyleWrapper = styled('div')`
  .project-flag-icon {
    color: ${({ theme }) =>
      theme.sqleTheme.order.createOrder.editForm.projectFlagIconColor};
    margin-right: 8px;
  }
`;

export const RuleListStyleWrapper = styled('section')`
  .no-project-rule-template-empty-content {
    .link-create-project-rule-template-btn {
      color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorPrimary} !important;
    }
  }
`;
