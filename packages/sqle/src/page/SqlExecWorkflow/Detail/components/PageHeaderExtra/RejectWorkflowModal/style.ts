import { styled } from '@mui/material/styles';

export const RejectWorkflowModalAlertStyleWrapper = styled('div')`
  display: flex;
  padding: 4px 8px;
  align-items: center;
  align-self: stretch;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
  background: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
`;
