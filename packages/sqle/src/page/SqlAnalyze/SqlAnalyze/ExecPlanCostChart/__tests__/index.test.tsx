import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import ExecPlanCostChart from '../index';
import { PieConfig } from '@ant-design/plots';
import { mockSqlManageSqlAnalysisChartData } from '../../../../../testUtils/mockApi/sqlManage/data';
import { fireEvent, act, screen, renderHook } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { DateRangeEnum } from '../index.data';
import { useState } from 'react';
import { IChartPoint } from '@actiontech/shared/lib/api/sqle/service/common';

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
      },
      mockDataRender: (props: PieConfig) => {
        return props.data.map((item: IChartPoint, index: number) => (
          <div
            key={index}
            data-testid={`data-point-${index}`}
            onClick={() =>
              props?.onEvent?.(
                {} as any,
                {
                  type: 'click',
                  data: {
                    data: item
                  }
                } as any
              )
            }
          >
            {item.x}: {item.y}
          </div>
        ));
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
      <ExecPlanCostChart onScrollIntoView={jest.fn()} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render chart when data is not empty', async () => {
    const { baseElement } = superRender(
      <ExecPlanCostChart
        onScrollIntoView={jest.fn()}
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
        onScrollIntoView={jest.fn()}
        getSqlExecPlanCostDataSourceError="网络错误"
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('filter sql execute plan cost', async () => {
    const getSqlExecPlanCostDataSourceSpy = jest.fn();
    const { baseElement } = superRender(
      <ExecPlanCostChart
        onScrollIntoView={jest.fn()}
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
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenNthCalledWith(3, {
      endTime: dayjs('2024-01-03 00:00:00'),
      startTime: dayjs('2024-01-01 00:00:00')
    });
  });

  it('refresh sql execute plan cost', async () => {
    const getSqlExecPlanCostDataSourceSpy = jest.fn();
    const { baseElement } = superRender(
      <ExecPlanCostChart
        onScrollIntoView={jest.fn()}
        getSqlExecPlanCostDataSource={getSqlExecPlanCostDataSourceSpy}
        sqlExecPlanCostDataSource={[]}
        getSqlExecPlanCostDataSourceLoading={false}
        initTime={dayjs('2024-01-09 12:00:00')}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenCalledTimes(1);
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenCalledWith({
      endTime: dayjs('2024-01-09 12:00:00'),
      lastPointEnabled: true,
      startTime: dayjs('2024-01-08 12:00:00'),
      rangeType: DateRangeEnum['24H']
    });
  });

  it('lastPointEnabled should be true when filter by 24 hours', async () => {
    const getSqlExecPlanCostDataSourceSpy = jest.fn();
    superRender(
      <ExecPlanCostChart
        onScrollIntoView={jest.fn()}
        getSqlExecPlanCostDataSource={getSqlExecPlanCostDataSourceSpy}
        sqlExecPlanCostDataSource={mockSqlManageSqlAnalysisChartData.points}
        getSqlExecPlanCostDataSourceLoading={false}
        initTime={dayjs('2024-01-09 12:00:00')}
      />
    );

    fireEvent.click(screen.getByText('7天'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenNthCalledWith(1, {
      endTime: dayjs('2024-01-09 12:00:00'),
      lastPointEnabled: true,
      startTime: dayjs('2024-01-02 12:00:00'),
      rangeType: DateRangeEnum['7D']
    });
    fireEvent.click(screen.getByText('24小时'));
    expect(getSqlExecPlanCostDataSourceSpy).toHaveBeenNthCalledWith(2, {
      endTime: dayjs('2024-01-09 12:00:00'),
      lastPointEnabled: true,
      startTime: dayjs('2024-01-08 12:00:00'),
      rangeType: DateRangeEnum['24H']
    });
  });

  it('click chart should update selected point', async () => {
    const { result } = renderHook(() =>
      useState<Array<IChartPoint | undefined>>([])
    );
    superRender(
      <ExecPlanCostChart
        onScrollIntoView={jest.fn()}
        sqlExecPlanCostDataSource={mockSqlManageSqlAnalysisChartData.points}
        getSqlExecPlanCostDataSourceLoading={false}
        initTime={dayjs('2024-01-09 12:00:00')}
        selectedPoint={result.current[0]}
        setSelectedPoint={result.current[1]}
      />
    );

    fireEvent.click(screen.getByTestId('data-point-1'));
    expect(result.current[0]).toEqual([
      mockSqlManageSqlAnalysisChartData.points[1]
    ]);

    fireEvent.click(screen.getByTestId('data-point-2'));
    expect(result.current[0]).toEqual([
      mockSqlManageSqlAnalysisChartData.points[1],
      mockSqlManageSqlAnalysisChartData.points[2]
    ]);

    fireEvent.click(screen.getByTestId('data-point-3'));
    expect(result.current[0]).toEqual([
      mockSqlManageSqlAnalysisChartData.points[1],
      mockSqlManageSqlAnalysisChartData.points[2]
    ]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText(
        '当前仅支持两个节点对比，请先取消一个已选节点后再进行选择'
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('data-point-1'));
    expect(result.current[0]).toEqual([
      mockSqlManageSqlAnalysisChartData.points[2]
    ]);

    fireEvent.click(screen.getByTestId('data-point-3'));
    expect(result.current[0]).toEqual([
      mockSqlManageSqlAnalysisChartData.points[2],
      mockSqlManageSqlAnalysisChartData.points[3]
    ]);
  });
});
