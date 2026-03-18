import { screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../../../testUtils/superRender';
import { EfficiencyCardMetricTitleEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EfficiencyCards from '.';

describe('ReportStatistics/AIGovernance/EfficiencyCards', () => {
  it('should match snapshot', () => {
    const { container } = sqleSuperRender(
      <EfficiencyCards
        cards={[
          {
            metric_title: EfficiencyCardMetricTitleEnum.security_defense,
            metric_evaluation: '高',
            evidence_value: '12'
          },
          {
            metric_title: EfficiencyCardMetricTitleEnum.query_performance,
            metric_evaluation: '中',
            evidence_value: '8'
          }
        ]}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('should render translated metric title and values', () => {
    sqleSuperRender(
      <EfficiencyCards
        cards={[
          {
            metric_title: EfficiencyCardMetricTitleEnum.code_standard,
            metric_evaluation: '良好',
            evidence_value: '20'
          }
        ]}
      />
    );

    expect(screen.getByText('SQL规范遵从率')).toBeInTheDocument();
    expect(screen.getByText('良好')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('should render fallback "-" when value is missing', () => {
    sqleSuperRender(
      <EfficiencyCards
        cards={[
          {
            metric_title: EfficiencyCardMetricTitleEnum.rd_efficiency
          }
        ]}
      />
    );

    expect(screen.getByText('预计节省工时')).toBeInTheDocument();
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });
});
