import { styled } from '@mui/material/styles';

export const PrivilegeCheckResultStyleWrapper = styled('div')`
  margin-top: 12px;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  display: flex;
  flex-direction: column;
  gap: 8px;

  .privilege-module-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .privilege-module-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .privilege-missing,
  .privilege-module-msg,
  .privilege-summary {
    font-size: 12px;
  }
`;
