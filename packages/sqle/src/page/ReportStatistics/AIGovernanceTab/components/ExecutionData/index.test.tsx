import { act, cleanup, screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import statistic from '@actiontech/shared/lib/testUtil/mockApi/sqle/statistic';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockThemeStyleData } from '../../../../../testUtils/mockHooks/mockThemeStyleData';
import ExecutionData from '.';

describe('ReportStatistics/AIGovernance/ExecutionData', () => {
  let requestExecutionData: jest.SpyInstance;

  const customRender = () => sqleSuperRender(<ExecutionData />);

  beforeEach(() => {
    jest.useFakeTimers();
    requestExecutionData = statistic.getAIHubExecutionData();
    mockUseCurrentUser();
    mockThemeStyleData();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should render loading and data snapshot', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(requestExecutionData).toHaveBeenCalled();
  });

  it('should render translated tags by enum values', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('执行数据')).toBeInTheDocument();
    expect(screen.getByText('数据层')).toBeInTheDocument();
    expect(screen.getAllByText('AI 智能修正').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AI 性能引擎').length).toBeGreaterThan(0);
    expect(screen.getAllByText('安全性').length).toBeGreaterThan(0);
    expect(screen.getAllByText('性能问题').length).toBeGreaterThan(0);
    expect(screen.getAllByText('待处理').length).toBeGreaterThan(0);
    expect(screen.getAllByText('处理中').length).toBeGreaterThan(0);
  });

  it('should auto scroll records when row count exceeds display count', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.queryByText('项目G')).not.toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(2000));

    expect(screen.getByText('项目G')).toBeInTheDocument();
  });

  it('should render empty data when api returns empty list', async () => {
    requestExecutionData.mockImplementation(() =>
      createSpySuccessResponse({
        data: [],
        total_nums: 0
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });
});
