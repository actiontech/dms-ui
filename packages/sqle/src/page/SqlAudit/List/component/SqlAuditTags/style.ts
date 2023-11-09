import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Button } from 'antd5';

export const SqlAuditTagsButton = styled(Button)`
  &.${ANTD_PREFIX_STR}-btn-circle.${ANTD_PREFIX_STR}-btn-sm {
    &.add-tag-focus-btn {
      padding: 0;
      width: 18px;
      max-width: 18px !important;
      min-width: 18px !important;
      height: 18px;
      border: 1px solid ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      display: flex;
      justify-content: center;
      align-items: center;

      .${ANTD_PREFIX_STR}-btn-icon {
        .anticon {
          font-size: 9px;
          font-weight: 500;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        }
      }
    }
  }
`;

export const SqlAuditTagsPopoverCont = styled('div')`
  &.tag-content-wrapper {
    .custom-tag-item {
      height: 32px;
      line-height: 32px;
      margin-bottom: 2px;
      padding: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorFillSecondary};
      }
    }
  }
`;
