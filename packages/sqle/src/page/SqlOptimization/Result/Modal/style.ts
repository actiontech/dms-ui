import { styled } from '@mui/material/styles';

export const TableStructureModalWrapper = styled('div')`
  .section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 0 4px;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      }
    }

    .section-content {
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      border-radius: 8px;
      overflow: hidden;
      max-height: 300px;
      overflow-y: auto;
    }
  }
`;

export const OptimizationResultModalWrapper = styled('div')`
  max-height: calc(100vh - 118px);
  overflow-y: auto;

  .rule-info {
    padding: 16px;
    background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    border-radius: 8px;
    border-left: 4px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
  }

  .performance-improvement-section.ant-space {
    background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    padding: 16px;
    border-radius: 8px;
    display: flex;
    align-items: flex-start;
    margin: 24px 0;
  }

  .sql-comparison {
    margin-bottom: 24px;

    .comparison-header {
      margin-bottom: 16px;

      .comparison-title {
        font-size: 16px;
        font-weight: 600;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      }
    }
  }
`;

export const QueryPlanDiffModalWrapper = styled('div')`
  display: flex;
  gap: 16px;
  height: 650px;

  &.fullscreen {
    .plan-section {
      flex: 1;
    }
  }

  .plan-section {
    flex: 1;
    display: flex;
    flex-direction: column;

    &.hidden {
      display: none !important;
    }

    .plan-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;

      .plan-title {
        font-size: 16px;
        font-weight: bold;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
        flex: 1;
      }

      .plan-actions {
        display: flex;
        align-items: center;
        gap: 8px;

        .ant-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};

          &:hover {
            color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
            background-color: ${({ theme }) =>
              theme.sharedTheme.uiToken.colorFillTertiary};
          }
        }
      }
    }

    .plan-content {
      flex: 1;
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      border-radius: 6px;
      overflow: hidden;
    }
  }
`;
