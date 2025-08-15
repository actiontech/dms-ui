import { styled } from '@mui/material/styles';
import { Card, Col, Row } from 'antd';

export const SqlOptimizationResultContainerWrapper = styled(Row)`
  margin-top: 60px;
  padding: 24px;

  .ant-space {
    width: 100%;
    height: 100%;
  }
`;

export const SqlOptimizationCardWrapper = styled(Card)`
  &.ant-card.sql-optimization-card {
    .ant-card-head {
      background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
      min-height: 50px;
      margin-bottom: 1px;
    }

    .ant-card-body {
      background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
      max-height: 300px;
      overflow-y: auto;
    }
  }

  &.ant-card.execution-plan-flow-card {
    .ant-card-body {
      padding: 0;
    }
  }
`;

export const SqlOptimizationRightContentWrapper = styled(Col)`
  background: rgba(255, 255, 255, 0.7);
  padding: 20px;

  .analysis-chart {
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    height: 300px;
    padding: 24px 0;
    border-radius: 12px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }
`;
