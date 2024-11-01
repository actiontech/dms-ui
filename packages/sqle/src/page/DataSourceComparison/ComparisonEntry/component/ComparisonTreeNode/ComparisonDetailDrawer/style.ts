import { styled } from '@mui/material/styles';
import { Collapse } from 'antd';

export const DiffSQLEditorWrapperStyleWrapper = styled('div')`
  margin-bottom: 24px;

  .ant-typography {
    font-size: 16px !important;
  }
`;

export const ModifiedSqlStyleWrapper = styled('div')`
  h4 {
    font-size: 16px !important;
  }
`;

export const SqlAuditResultCollapseStyleWrapper = styled(Collapse)`
  &.ant-collapse {
    margin: 24px 0 !important;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary} !important;

    .ant-collapse-item {
      border-bottom: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary} !important;
    }

    .ant-collapse-content {
      border-top: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary} !important;
    }
  }
`;

export const SqlAuditResultStyleWrapper = styled('div')`
  padding: 0 24px;
  overflow-y: auto;
  max-height: 300px;

  .result-item {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
