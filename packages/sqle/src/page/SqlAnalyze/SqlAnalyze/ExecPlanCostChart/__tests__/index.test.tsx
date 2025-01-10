import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import ExecPlanCostChart from '../index';
import { PieConfig } from '@ant-design/plots';
import { mockSqlManageSqlAnalysisChartData } from '../../../../../testUtils/mockApi/sqlManage/data';
import { fireEvent, act, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

jest.mock('@ant-design/plots', () => {
  return {
    ...jest.requireActual('@ant-design/plots'),
    Line: jest.requireActual('@ant-design/plots').LineWithCustomRenderCalled({
      tooltip: {
        customContent: (props: PieConfig) => {
          return [
            '',
            [
              {
                color: '#6094FC',
                name: props.data[0]?.name,
                value: props.data[0]?.value,
                data: mockSqlManageSqlAnalysisChartData.points[0]
              }
            ]
          ];
        }
      }
    })
  };
});

describe('ExecPlanCostChart', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set(dayjs('2024-01-09 12:00:00').valueOf());
  });

  afterEach(() => {
    jest.useRealTimers();
    MockDate.reset();
  });

  it('render init snap shot', async () => {
    const { baseElement } = superRender(
      <ExecPlanCostChart setHistoryExecPlan={jest.fn()} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render chart when data is not empty', async () => {
    const { baseElement } = superRender(
      <ExecPlanCostChart
        setHistoryExecPlan={jest.fn()}
        getSqlExecPlanCostDataSource={jest.fn()}
        sqlExecPlanCostDataSource={mockSqlManageSqlAnalysisChartData.points}
        getSqlExecPlanCostDataSourceLoading={false}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render error message', async () => {
    const { baseElement } = superRender(
      <ExecPlanCostChart
        setHistoryExecPlan={jest.fn()}
        getSqlExecPlanCostDataSourceError="网络错误"
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('filter sql execute plan cost', async () => {
    const getSqlExecPlanCostDataSourceSpy = jest.fn();
    const { baseElement } = superRender(
      <ExecPlanCostChart
        setHistoryExecPlan={jest.fn()}
        getSqlExecPlanCostDataSource={getSqlExecPlanCostDataSourceSpy}
        sqlExecPlanCostDataSource={mockSqlManageSqlAnalysisChartData.points}
        getSqlExecPlanCostDataSourceLoading={false}
      />
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('7天'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('30天'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenCalledTimes(2);
    expect(getBySelector('.ant-segmented')).not.toHaveClass(
      '.ant-segmented-disabled'
    );

    fireEvent.click(getBySelector('.ant-picker'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('td[title="2024-01-01"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.ant-picker-ok button'));
    fireEvent.click(getBySelector('td[title="2024-01-03"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.ant-picker-ok button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenCalledTimes(3);
  });

  it('refresh sql execute plan cost', async () => {
    const getSqlExecPlanCostDataSourceSpy = jest.fn();
    const { baseElement } = superRender(
      <ExecPlanCostChart
        setHistoryExecPlan={jest.fn()}
        getSqlExecPlanCostDataSource={getSqlExecPlanCostDataSourceSpy}
        sqlExecPlanCostDataSource={[]}
        getSqlExecPlanCostDataSourceLoading={false}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenCalledTimes(1);
  });
});
