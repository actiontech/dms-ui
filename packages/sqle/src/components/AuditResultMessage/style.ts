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

export const AuditResultMessageWithAnnotationStyleWrapper = styled('div')`
  .annotation-wrapper {
    width: 100%;
    margin-bottom: 0;
    color: #8a8f99;
    font-size: 12px;
    font-weight: 400;
    margin-left: 32px;
    margin-top: 8px;
  }
`;
