import { styled } from '@mui/material/styles';

export const AuditResultDrawerTitleStyleWrapper = styled(`div`)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .audit-result-drawer-number {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
  }
`;
