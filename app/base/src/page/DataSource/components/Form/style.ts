import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const FormCheckConnectableInfoModalWrapper = styled('div')`
  max-height: 500px;
  overflow-y: auto;
`;

export const SqlAuditFieldsSubTitleWrapper = styled(Space)`
  margin-bottom: 16px;

  h1.ant-typography {
    height: 30px !important;
    line-height: 30px !important;
  }
`;

export const DataSourceSqlAuditConfigurationStyleWrapper = styled('div')`
  & .ant-form-item.top-switch {
    padding-right: 12px;

    .ant-form-item-control-input-content {
      display: flex;
      justify-content: flex-end;
    }
  }

  & .ant-form-item.last-switch {
    padding: 12px;

    .ant-form-item-control-input-content {
      display: flex;
      justify-content: flex-end;
    }
  }

  .audit-configuration-wrapper {
    padding: 12px 0;
    overflow: hidden;
  }

  .audit-fields-wrapper {
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

    .ant-form-item:last-child {
      margin-bottom: 0;
    }
  }

  .workbench-audit-fields {
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

    .workbench-audit-content {
      padding: 12px 12px 12px 24px;
    }
  }

  & .ant-form-item.no-margin-field {
    margin-bottom: 0;
  }
`;
