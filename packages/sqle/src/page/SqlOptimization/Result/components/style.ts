import { styled } from '@mui/material/styles';

export const SqlDiffStyleWrapper = styled('div')`
  .diff-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 0 4px;

    .diff-label {
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 0 8px;
    }
  }
`;

export const QueryPlanFlowWrapper = styled('div')`
  width: 100%;

  .react-flow__node-queryPlanNode {
    background: transparent !important;
    border: none !important;
  }

  .react-flow__attribution {
    display: none;
  }

  .react-flow__controls {
    bottom: 10px;
    left: 10px;
  }

  .react-flow__edge {
    stroke: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    stroke-width: 2;
  }

  /* .react-flow__edge-path {
    stroke: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
  } */

  .react-flow__handle {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    border: 2px solid ${({ theme }) => theme.sharedTheme.uiToken.colorBgLayout};
    width: 8px;
    height: 8px;
  }
`;

export const QueryPlanNodeWrapper = styled('div')`
  .query-plan-node-card {
    width: 200px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    border-radius: 4px;
    pointer-events: auto;
  }

  .operator-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    padding: 8px 12px;
    pointer-events: auto;

    &:hover {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillSecondary};
    }

    .operator-left {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .collapse-icon {
      cursor: pointer;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      font-size: 10px;
      transition: color 0.2s ease;

      &:hover {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      }
    }

    .operator-title {
      font-size: 12px;
      margin: 0;
    }
  }

  .content-text {
    padding: 8px 12px;
  }

  .node-index {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 8px;
    line-height: 1;
  }

  .operator-tag {
    margin: 0;
    font-size: 11px;
    font-weight: 500;
    border-radius: 4px;
  }

  .summary-item {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    line-height: 1.3;
    word-break: break-all;
  }
`;

export const ProbabilityDisplayWrapper = styled('div')`
  display: flex;
  align-items: flex-end;
  gap: 8px;

  .probability-number {
    font-size: 50px;
    font-style: normal;
    font-weight: 700;
    line-height: 1;
    background: linear-gradient(90deg, #ffa033 0%, #fac000 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const OptimizeStepsWrapper = styled('div')`
  .steps-header {
    margin-bottom: 24px;
  }

  .steps-list {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-radius: 8px;
    padding: 4px;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
  }

  .step-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgHover};

      .step-number {
        background: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        color: white;
      }
    }
  }

  .step-number {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    transition: all 0.2s ease;
  }

  .step-content {
    flex: 1;
    overflow: hidden;

    .ant-typography {
      width: 100%;

      .ant-typography-expand {
        pointer-events: none;
      }
    }
  }

  .step-title {
    font-size: 14px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorInfo};
    margin-bottom: 8px;
  }

  .step-description {
    font-size: 13px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    line-height: 1.5;
    margin-bottom: 8px;
  }

  .show-more {
    font-size: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }
  }
`;
