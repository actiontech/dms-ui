import { styled } from '@mui/material/styles';

export const OperationTypeStyleWrapper = styled('div')`
  display: flex;
  justify-content: start;
  align-items: center;
  align-content: center;
  align-self: stretch;
  width: 100%;
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
    theme.diagnosisTheme.userManagement.permissionType.border};
  background: ${({ theme, active }) =>
    !!active
      ? theme.diagnosisTheme.userManagement.permissionType.activeBackgroundColor
      : theme.diagnosisTheme.userManagement.permissionType.backgroundColor};
  color: ${({ theme, active }) =>
    !!active
      ? theme.diagnosisTheme.userManagement.permissionType.activeColor
      : theme.diagnosisTheme.userManagement.permissionType.color};
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
