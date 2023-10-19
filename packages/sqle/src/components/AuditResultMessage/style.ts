import { styled } from '@mui/material/styles';

export const AuditResultMessageStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  > .icon-wrapper {
    width: 20px;
    margin-right: 12px;
    display: inline-flex;
    align-items: center;
  }

  > .text-wrapper {
    flex: 1;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    word-break: break-all;
  }
`;
