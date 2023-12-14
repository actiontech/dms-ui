import { styled } from '@mui/material/styles';

export const OperationTypeStyleWrapper = styled('div')`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 20px 40px;
  align-content: center;
  align-self: stretch;
  width: 100%;
  border-bottom: 1px solid #e8e7e6;
`;

export const OperationTypeItemStyleWrapper = styled('div')<{
  active?: boolean;
}>`
  display: flex;
  height: 28px;
  padding: 0 8px;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  border: ${({ theme }) =>
    theme.sharedTheme.components.ruleComponent.ruleType.border};
  background: ${({ theme, active }) =>
    !!active
      ? theme.sharedTheme.components.ruleComponent.ruleType
          .activeBackgroundColor
      : theme.sharedTheme.components.ruleComponent.ruleType.backgroundColor};
  color: ${({ theme, active }) =>
    !!active
      ? theme.sharedTheme.components.ruleComponent.ruleType.activeColor
      : theme.sharedTheme.components.ruleComponent.ruleType.color};
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  transition: color 0.3s;
  transition: background-color 0.3s;

  &:not(:first-of-type) {
    margin-left: 8px;
  }
`;
