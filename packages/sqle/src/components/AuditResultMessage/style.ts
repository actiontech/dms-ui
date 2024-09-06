import { styled } from '@mui/material/styles';

import { AuditResultMessageProps } from './index.type';
import { BasicTag } from '@actiontech/shared';

export const ResultIconTagStyleWrapper = styled(BasicTag)`
  width: fit-content;
`;

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

  & .annotation-wrapper .ant-typography {
    display: inline-block;
    margin-left: 8px;
    font-size: 12px;
  }

  &.has-delete-rule-wrapper {
    position: relative;
    padding-top: 26px !important;

    .message-rule-disabled {
      position: absolute;
      top: 4px;
      right: -4px;
    }
  }
`;
