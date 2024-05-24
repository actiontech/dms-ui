import { styled } from '@mui/material';

export const WorkflowDetailStyleWrapper = styled('section')<{
  workflowStepsVisibility: boolean;
}>`
  display: flex;

  .workflow-detail-content {
    width: ${({ workflowStepsVisibility }) =>
      workflowStepsVisibility ? 'calc(100% - 360px)' : '100%'} !important;
    transition: width 0.3s ease;
  }
`;
