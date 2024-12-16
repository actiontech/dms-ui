import { BasicCollapseStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { styled } from '@mui/material/styles';

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

export const SqlAuditResultCollapseStyleWrapper = styled(
  BasicCollapseStyleWrapper
)`
  &.ant-collapse {
    margin: 24px 0 !important;
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

export const DiffSQLEditorSubTitleStyleWrapper = styled('div')`
  margin: 12px 0;
  display: flex;

  .subtitle-item-wrapper {
    width: 50%;
    display: flex;
    font-size: 16px;
    align-items: center;

    .subtitle-item-text {
      margin-left: 4px;
      line-height: 16px;
    }
  }
`;
