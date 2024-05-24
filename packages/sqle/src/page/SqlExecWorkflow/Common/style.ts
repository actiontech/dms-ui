import { styled } from '@mui/material';

export const ToggleButtonStyleWrapper = styled('div')<{
  active: boolean;
}>`
  height: 28px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid
    ${({ theme }) =>
      theme.sqleTheme.execWorkflow.create.auditResult.toggleButton.borderColor};
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ active, theme }) =>
    !!active
      ? theme.sqleTheme.execWorkflow.create.auditResult.toggleButton.activeColor
      : theme.sqleTheme.execWorkflow.create.auditResult.toggleButton.color};
  background: ${({ active, theme }) =>
    !!active
      ? theme.sqleTheme.execWorkflow.create.auditResult.toggleButton
          .activeBgColor
      : theme.sqleTheme.execWorkflow.create.auditResult.toggleButton.bgColor};
`;
