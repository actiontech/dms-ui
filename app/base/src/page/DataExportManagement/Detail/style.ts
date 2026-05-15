import { styled } from '@mui/material/styles';

export const WorkflowDetailStyleWrapper = styled('section')<{
  workflowStepOpen: boolean;
}>`
  display: flex;

  .workflow-detail-content {
    width: ${({ workflowStepOpen }) =>
      workflowStepOpen ? 'calc(100% - 360px)' : '100%'} !important;
  }
`;
