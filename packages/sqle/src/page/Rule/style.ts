import { styled } from '@mui/material/styles';
import { FilterContainerStyleWrapper } from '@actiontech/shared/lib/components/ActiontechTable/components/style';

export const RuleListProjectFilterStyleWrapper = styled('div')`
  .project-flag-icon {
    color: ${({ theme }) =>
      theme.sqleTheme.execWorkflow.create.editForm.projectFlagIconColor};
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

export const RuleListFilterStyleWrapper = styled(FilterContainerStyleWrapper)`
  border-bottom: 0;
  padding: 0;
  & .ant-form.ant-form-horizontal {
    .ant-select-selector,
    .custom-search-input {
      font-size: 13px !important;
    }
  }
`;
