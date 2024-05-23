import { styled } from '@mui/material/styles';
import { Space, Row } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

export const CloudBeaverContentStyleWrapper = styled('section')`
  padding: 30px 40px 0;
`;

export const CloudBeaverContentSpaceStyleWrapper = styled(Space)`
  width: 100%;
`;

export const CloudBeaverContentIconStyleWrapper = styled(WarningOutlined)`
  font-size: 50px;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning} !important;
`;

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

export const CloudBeaverOperationLogsListStyleWrapper = styled('section')`
  .audit-result-wrapper,
  .ellipsis-column-width .ant-typography {
    cursor: pointer;
  }
`;
