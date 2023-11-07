import { styled } from '@mui/material/styles';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { AuditResultMessageProps } from './index.type';

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

export const AuditResultMessageWithAnnotationStyleWrapper = styled('div')<{
  showAnnotation: AuditResultMessageProps['showAnnotation'];
}>`
  cursor: ${(showAnnotation) => (showAnnotation ? 'pointer' : 'default')};

  .annotation-wrapper {
    width: 100%;
    margin-bottom: 0;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 12px;
    font-weight: 400;
    padding-left: 32px;
    margin-top: 8px;
  }

  & .annotation-wrapper .${ANTD_PREFIX_STR}-typography {
    display: inline-block;
    margin-left: 8px;
  }
`;
