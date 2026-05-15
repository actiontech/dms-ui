import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { mockThemeStyleData } from '../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import statistic from '@actiontech/shared/lib/testUtil/mockApi/sqle/statistic';
import AIGovernanceTab from '.';

describe('ReportStatistics/AIGovernanceTab', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    statistic.getAIHubStrategicValue();
    statistic.getAIHubManagementView();
    statistic.getAIHubExecutionData();
    mockThemeStyleData();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match snapshot', async () => {
    const { baseElement } = sqleSuperRender(<AIGovernanceTab />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render title and all sections', async () => {
    sqleSuperRender(<AIGovernanceTab />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('AI 智能效能中心')).toBeInTheDocument();
    expect(screen.getByText('战略价值')).toBeInTheDocument();
    expect(screen.getByText('管理视图')).toBeInTheDocument();
    expect(screen.getByText('执行数据')).toBeInTheDocument();
    expect(screen.getByText('重写项目A')).toBeInTheDocument();
    expect(screen.getByText('项目组投入产出分析')).toBeInTheDocument();
  });

  it('should switch management view data when click segmented option', async () => {
    sqleSuperRender(<AIGovernanceTab />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('重写项目A')).toBeInTheDocument();
    expect(screen.queryByText('调优项目B')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByText('AI 性能引擎')[0]);
    expect(screen.getByText('调优项目B')).toBeInTheDocument();
    expect(screen.queryByText('重写项目A')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByText('AI 智能修正')[0]);
    expect(screen.getByText('重写项目A')).toBeInTheDocument();
  });
});
