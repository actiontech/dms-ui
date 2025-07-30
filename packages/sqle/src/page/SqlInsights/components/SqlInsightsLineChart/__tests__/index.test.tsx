import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import SqlInsightsLineChart, { SqlInsightsLineChartProps } from '../index';
import { ILine } from '@actiontech/shared/lib/api/sqle/service/common';

describe('SqlInsightsLineChart', () => {
  const mockChartData: ILine[] = [
    {
      line_name: 'Line 1',
      points: [
        { x: '2023-01-01', y: 10, status: 0 },
        { x: '2023-01-02', y: 20, status: 1 },
        { x: '2023-01-03', y: 15, status: 0 }
      ]
    },
    {
      line_name: 'Line 2',
      points: [
        { x: '2023-01-01', y: 5, status: 0 },
        { x: '2023-01-02', y: 15, status: 0 },
        { x: '2023-01-03', y: 25, status: 1 }
      ]
    }
  ];

  const defaultProps: SqlInsightsLineChartProps = {
    loading: false,
    title: 'Test Chart',
    chartData: mockChartData,
    className: 'test-class'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render init chart', () => {
    const { container } = superRender(
      <SqlInsightsLineChart {...defaultProps} />
    );
    expect(container).toMatchSnapshot();
  });

  it('render chart when errorInfo is exited', async () => {
    const { container } = superRender(
      <SqlInsightsLineChart {...defaultProps} errorInfo="error" />
    );
    expect(container).toMatchSnapshot();
  });

  it('render chart when chartData is empty', async () => {
    const { container } = superRender(
      <SqlInsightsLineChart {...defaultProps} chartData={[]} />
    );
    expect(container).toMatchSnapshot();
  });

  it('render chart when isTaskEnabled is false', async () => {
    const onGoToEnableFn = jest.fn();
    const { container } = superRender(
      <SqlInsightsLineChart
        {...defaultProps}
        isTaskEnabled={false}
        onGoToEnable={onGoToEnableFn}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
