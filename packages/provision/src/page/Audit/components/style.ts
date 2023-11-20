import { styled } from '@mui/material/styles';
import { BasicDrawer } from '@actiontech/shared';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';

export const AuthAuditDetailDrawerStyleWrapper = styled(BasicDrawer)`
  &.basic-drawer-wrapper.${ANTD_PREFIX_STR}-drawer-content
    .${ANTD_PREFIX_STR}-drawer-wrapper-body
    .${ANTD_PREFIX_STR}-drawer-body {
    padding: 0 24px;
  }

  .audit-info-wrapper {
    padding: 24px 0;

    &:not(:last-child) {
      border-bottom: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    }
  }

  .audit-info-wrapper .audit-info-title {
    height: 20px;
    font-size: 13px;
    line-height: 20px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    margin-bottom: 16px;
    font-weight: bold;
  }

  .audit-card {
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 4px 0
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    margin-bottom: 12px;

    &-action {
      margin-top: 8px;
      display: flex;
      justify-content: center;
    }
  }
`;

export const AuthAuditDetailItemStyleWrapper = styled('div')`
  display: flex;
  line-height: 20px;
  padding: 8px 0;
  align-items: center;

  & .audit-info-item-label {
    width: 100px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-weight: 400;
  }

  & .audit-info-item-value {
    flex: 1;

    .${ANTD_PREFIX_STR}-space-item {
      word-break: break-word;
    }

    .${ANTD_PREFIX_STR}-space-item:first-of-type {
      display: inline-flex;
      align-items: center;
    }
  }
`;
