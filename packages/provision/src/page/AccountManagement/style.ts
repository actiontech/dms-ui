import { styled } from '@mui/material/styles';
import { Row, Space } from 'antd';
import { BasicTable } from '@actiontech/shared';

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
