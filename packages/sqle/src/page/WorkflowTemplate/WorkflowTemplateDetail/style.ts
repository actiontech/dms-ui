import { styled } from '@mui/material/styles';

export const WorkflowTemplateStyleWrapper = styled('div')`
  height: 100%;

  .workflow-template-wrapper {
    height: 100%;
  }

  .workflow-template-right-module {
    border-left: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo.borderBottom};
    height: auto;
  }
`;
