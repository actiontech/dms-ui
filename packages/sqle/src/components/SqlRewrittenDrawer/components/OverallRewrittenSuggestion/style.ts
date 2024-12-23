import { styled } from '@mui/material';
import { Alert } from 'antd';

export const OverallRewrittenItemStyleWrapper = styled('div')`
  margin-bottom: 18px;
`;

export const OverallRewrittenTitleStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .title-wrapper {
    display: flex;
    align-items: center;

    .title-text {
      margin-left: 8px;
      font-weight: 500;
      font-size: 16px;
    }
  }

  .action-items-wrapper {
    display: flex;

    .toggle-button-wrapper {
      margin-left: 12px;
    }
  }
`;

export const BusinessWarningStyleWrapper = styled(Alert)`
  box-shadow: 0 4px 8px
    ${({ theme }) => theme.sharedTheme.basic.colorShadowByWhite};
`;

export const DiffSQLEditorSubTitleStyleWrapper = styled('div')`
  margin: 12px 0;
  display: flex;
`;

export const ExecuteOrderExplanationStyleWrapper = styled('div')`
  display: flex;
  gap: 2px;

  .execute-item {
    flex: 1;

    .execute-item-content {
      height: 500px;
      overflow-y: auto;
    }
  }
`;

export const SqlComparisonTitleStyleWrapper = styled('div')`
  width: 50%;
  display: flex;
  font-size: 16px;
  align-items: center;
  padding-left: 4px;

  .subtitle-item-text {
    margin-left: 8px;
    line-height: 16px;
    font-size: 14px;
  }

  .sql-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  &.original .sql-indicator {
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
  }

  &.optimized .sql-indicator {
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
  }
`;
