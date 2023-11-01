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
  }
`;

export const AuthAuditDetailItemStyleWrapper = styled('div')`
  display: flex;
  line-height: 20px;
  align-items: center;
  padding: 8px 0;

  & .audit-info-item-label {
    width: 120px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }

  & .audit-info-item-value {
    .antd-v5-space-item:first-of-type {
      display: inline-flex;
      align-items: center;
    }
  }
`;
