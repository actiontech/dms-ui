import { styled } from '@mui/material/styles';

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

  > .audit-result-priority-label {
    flex-shrink: 0;
    margin-right: 8px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
  }

  > .text-wrapper {
    flex: 1;
    min-width: 0;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    word-break: break-all;
  }

  > .desc-row-more-link {
    flex-shrink: 0;
    margin-left: 8px;
    font-size: 13px;
    line-height: 20px;
    white-space: nowrap;
  }
`;

export const AuditResultMessageWithAnnotationStyleWrapper = styled('div')<{
  expandable?: boolean;
}>`
  cursor: ${({ expandable }) => (expandable ? 'pointer' : 'default')};

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

export const AuditLevelSummaryStyleWrapper = styled('div')`
  .audit-level-summary-item {
    display: inline-flex;
    align-items: center;
    /* chrome 80: avoid flex gap */
    margin-right: 4px;
  }

  .audit-level-summary-item .audit-level-summary-label {
    margin-left: 4px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
  }

  .audit-level-summary-count {
    margin-left: 4px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
  }
`;
