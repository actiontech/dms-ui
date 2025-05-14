import { styled } from '@mui/material/styles';

export const RuleListProjectFilterStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RuleListStyleWrapper = styled('div')`
  width: 100%;

  .no-project-rule-template-empty-content {
    text-align: center;

    .link-create-project-rule-template-btn {
      color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorPrimary} !important;
      margin: 0 2px;
    }
  }
`;

export const RuleBaseInfoStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  .base-info-item {
    margin-bottom: 0 !important;
    margin-right: 16px !important;
  }
`;
