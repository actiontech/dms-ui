import { alpha, styled } from '@mui/material/styles';

export const EfficiencyCardsStyleWrapper = styled('div')`
  .ant-row {
    flex-wrap: nowrap;
  }

  .efficiency-card {
    text-align: left;
    height: 100%;
    border-radius: 8px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    .ant-card-body {
      padding: 20px;
    }

    .card-icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 12px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      background-color: ${({ theme }) =>
        alpha(theme.sharedTheme.uiToken.colorTextTertiary, 0.1)};

      &.metric-security_defense {
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.securityDefense};
        background-color: ${({ theme }) =>
          alpha(
            theme.sqleTheme.reportStatistics.StrategicInsight
              .efficiencyCardEvaluationLine.securityDefense,
            0.1
          )};
      }

      &.metric-resource_cost {
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.resourceCost};
        background-color: ${({ theme }) =>
          alpha(
            theme.sqleTheme.reportStatistics.StrategicInsight
              .efficiencyCardEvaluationLine.resourceCost,
            0.1
          )};
      }

      &.metric-code_standard {
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.codeStandard};
        background-color: ${({ theme }) =>
          alpha(
            theme.sqleTheme.reportStatistics.StrategicInsight
              .efficiencyCardEvaluationLine.codeStandard,
            0.1
          )};
      }

      &.metric-rd_efficiency {
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.rdEfficiency};
        background-color: ${({ theme }) =>
          alpha(
            theme.sqleTheme.reportStatistics.StrategicInsight
              .efficiencyCardEvaluationLine.rdEfficiency,
            0.1
          )};
      }

      &.metric-query_performance {
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.queryPerformance};
        background-color: ${({ theme }) =>
          alpha(
            theme.sqleTheme.reportStatistics.StrategicInsight
              .efficiencyCardEvaluationLine.queryPerformance,
            0.1
          )};
      }
    }

    .card-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .card-title {
      font-size: 12px;
      font-weight: 700;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.StrategicInsight.efficiencyCard
          .titleColor};
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .card-evaluation {
      font-size: 30px;
      font-weight: 800;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.StrategicInsight.efficiencyCard
          .evaluationColor};
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .card-value {
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.StrategicInsight.efficiencyCard
          .valueColor};
      padding: 8px;
      padding-left: 16px;
      position: relative;
      line-height: 1.4;
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      border-radius: 4px;
      border-width: 1px;

      &::before {
        content: '';
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        border-radius: 9999px;
        background-color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight.efficiencyCard
            .valueColor};
      }

      &.metric-security_defense::before {
        background-color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.securityDefense};
      }

      &.metric-resource_cost::before {
        background-color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.resourceCost};
      }

      &.metric-code_standard::before {
        background-color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.codeStandard};
      }

      &.metric-rd_efficiency::before {
        background-color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.rdEfficiency};
      }

      &.metric-query_performance::before {
        background-color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight
            .efficiencyCardEvaluationLine.queryPerformance};
      }
    }

    .card-business-value {
      font-size: 10px;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.StrategicInsight.efficiencyCard
          .businessValueColor};
      margin-top: 8px;
      padding-left: 4px;
      line-height: 1.5;

      .ant-typography {
        font-size: 10px;
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight.efficiencyCard
            .businessValueColor};
      }
    }
  }
`;
