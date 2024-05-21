import { styled } from '@mui/material';

export const ToggleButtonStyleWrapper = styled('div')<{ active: boolean }>`
  height: 28px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid
    ${({ theme }) =>
      theme.sqleTheme.order.createOrder.auditResult.toggleButton.borderColor};
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ active, theme }) =>
    !!active
      ? theme.sqleTheme.order.createOrder.auditResult.toggleButton.activeColor
      : theme.sqleTheme.order.createOrder.auditResult.toggleButton.color};
  background: ${({ active, theme }) =>
    !!active
      ? theme.sqleTheme.order.createOrder.auditResult.toggleButton.activeBgColor
      : theme.sqleTheme.order.createOrder.auditResult.toggleButton.bgColor};
`;
