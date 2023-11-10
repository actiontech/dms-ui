import { styled } from '@mui/material/styles';
import { BasicDrawer } from '@actiontech/shared';

export const AuthAuditDetailDrawerStyleWrapper = styled(BasicDrawer)`
  &.basic-drawer-wrapper.antd-v5-drawer-content
    .antd-v5-drawer-wrapper-body
    .antd-v5-drawer-body {
    padding: 0 24px;
  }

  .audit-info-wrapper .audit-info-title {
    height: 20px;
    font-size: 13px;
    line-height: 20px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    margin: 24px 0 16px;
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
    width: 120px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-weight: 400;
  }

  & .audit-info-item-value {
    flex: 1;

    .antd-v5-space-item:first-of-type {
      display: inline-flex;
      align-items: center;
    }
  }
`;
