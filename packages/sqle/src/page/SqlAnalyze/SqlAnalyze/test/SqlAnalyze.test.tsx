import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import SqlAnalyze from '../SqlAnalyze';
import { SQLManageSqlAnalyzeData } from '../../__testData__';
import { mockSqlManageSqlAnalysisChartData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlManage/data';
import { screen } from '@testing-library/dom';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

describe('SqlAnalyze/Global-SqlAnalyze', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set(dayjs('2024-01-09 12:00:00').valueOf());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  it('render snap when data is loading', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={true}
        tableMetas={{}}
        sqlExplain={{}}
        performanceStatistics={{}}
        errorMessage={''}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when errorType is error', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={{}}
        sqlExplain={{}}
        performanceStatistics={{}}
        errorMessage={'mock error info'}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when errorType is info', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={{}}
        sqlExplain={{}}
        performanceStatistics={{}}
        errorType={'info'}
        errorMessage={'mock error info'}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when data is empty', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={{}}
        sqlExplain={{}}
        performanceStatistics={{}}
        errorMessage={''}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when have data', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={SQLManageSqlAnalyzeData.table_metas}
        sqlExplain={SQLManageSqlAnalyzeData.sql_explain}
        performanceStatistics={SQLManageSqlAnalyzeData.performance_statistics}
        errorMessage={''}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when showExecPlanCostChart is true', async () => {
    const getSqlExecPlanCostDataSourceSpy = jest.fn();
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={SQLManageSqlAnalyzeData.table_metas}
        sqlExplain={SQLManageSqlAnalyzeData.sql_explain}
        performanceStatistics={SQLManageSqlAnalyzeData.performance_statistics}
        errorMessage={''}
        sqlExecPlanCostDataSource={mockSqlManageSqlAnalysisChartData.points}
        getSqlExecPlanCostDataSourceLoading={false}
        getSqlExecPlanCostDataSource={getSqlExecPlanCostDataSourceSpy}
        showExecPlanCostChart
        initTime={dayjs('2024-01-09 12:00:00')}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL执行计划代价趋势')).toBeInTheDocument();
  });

  it('render snap when showExecPlanCostChart is true and selectedPoint is not empty', async () => {
    const getSqlExecPlanCostDataSourceSpy = jest.fn();
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={SQLManageSqlAnalyzeData.table_metas}
        sqlExplain={SQLManageSqlAnalyzeData.sql_explain}
        performanceStatistics={SQLManageSqlAnalyzeData.performance_statistics}
        errorMessage={''}
        sqlExecPlanCostDataSource={mockSqlManageSqlAnalysisChartData.points}
        getSqlExecPlanCostDataSourceLoading={false}
        getSqlExecPlanCostDataSource={getSqlExecPlanCostDataSourceSpy}
        showExecPlanCostChart
        initTime={dayjs('2024-01-09 12:00:00')}
        selectedPoint={[
          mockSqlManageSqlAnalysisChartData.points[0],
          mockSqlManageSqlAnalysisChartData.points[1]
        ]}
        setSelectedPoint={jest.fn()}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL执行计划代价趋势')).toBeInTheDocument();
    expect(
      screen.getByText(mockSqlManageSqlAnalysisChartData.points[0].x)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockSqlManageSqlAnalysisChartData.points[1].x)
    ).toBeInTheDocument();
  });

  it('render snap when init time and cost is not undefined', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={SQLManageSqlAnalyzeData.table_metas}
        performanceStatistics={SQLManageSqlAnalyzeData.performance_statistics}
        errorMessage={''}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('执行计划')).toBeInTheDocument();
  });
});
