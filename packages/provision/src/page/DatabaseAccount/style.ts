import { styled } from '@mui/material/styles';
import { Row, Space } from 'antd';
import { BasicTable, BasicDrawer, BasicTag } from '@actiontech/shared';

export const AccountStatisticsStyleWrapper = styled(Row)`
  padding: 24px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

  .total-item:first-of-type {
    .ant-typography {
      color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorPrimary} !important;
    }
  }

  .statistics-item {
    padding: 16px 0 8px;
    width: 100%;
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    text-align: center;
    border-radius: 4px;
  }
`;

export const AccountTableFieldStyleWrapper = styled(BasicTable)`
  &.ant-table-wrapper.actiontech-table-namespace {
    padding-bottom: 0;
  }
`;

export const CreateAccountFormStyleWrapper = styled('section')`
  width: 1000px;
  margin: 0 auto;
  padding-bottom: 60px;
`;

export const ServiceFieldStyleWrapper = styled(Space)`
  &.ant-space.ant-space-horizontal {
    display: flex;
  }

  & .ant-space-item:first-of-type {
    flex: 1;
  }
`;

export const PermissionFieldTitleStyleWrapper = styled('section')`
  padding: 14px 0;
  border-bottom: ${({ theme }) => theme.sharedTheme.components.toolbar.border};
  border-top: ${({ theme }) => theme.sharedTheme.components.toolbar.border};
  display: flex;

  .permission-field-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    flex: 1;
  }
`;

export const AccountDetailDrawerStyleWrapper = styled(BasicDrawer)`
  &.basic-drawer-wrapper.ant-drawer-content
    .ant-drawer-wrapper-body
    .ant-drawer-body {
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

export const AccountInfoItemStyleWrapper = styled('div')`
  display: flex;
  line-height: 20px;
  padding: 8px 0;
  align-items: center;

  & .audit-info-item-label {
    width: 160px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-weight: 400;
  }

  & .audit-info-item-value {
    flex: 1;

    .ant-space-item {
      word-break: break-word;
    }

    .ant-space-item:first-of-type {
      display: inline-flex;
      align-items: center;
    }
  }
`;

export const PermissionFieldStyleWrapper = styled('section')`
  & .ant-table-wrapper.actiontech-table-namespace {
    padding-bottom: 0 !important;
  }
`;

export const BatchModifyPasswordDrawerStyleWrapper = styled(BasicDrawer)`
  & .account-name-item {
    display: block !important;
  }
`;

export const OriginalPermissionStyleWrapper = styled(BasicTag)`
  &.ant-tag.ant-tag-default.basic-tag-wrapper {
    white-space: pre-wrap;
    padding: 6px;
    height: auto;
    /* max-width: 472px; */
  }
`;
