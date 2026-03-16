import { act, cleanup, screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { mockThemeStyleData } from '../../../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import statistic from '@actiontech/shared/lib/testUtil/mockApi/sqle/statistic';
import EmitterKey from '../../../../../data/EmitterKey';
import eventEmitter from '../../../../../utils/EventEmitter';
import StrategicInsight from '.';

describe('ReportStatistics/AIGovernance/StrategicInsight', () => {
  let requestStrategicValueSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    requestStrategicValueSpy = statistic.getAIHubStrategicValue();
    mockThemeStyleData();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should render strategic insight module and efficiency cards', async () => {
    const { baseElement } = sqleSuperRender(<StrategicInsight />);

    await act(async () => jest.advanceTimersByTime(3300));

    expect(requestStrategicValueSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('战略价值')).toBeInTheDocument();
    expect(screen.getByText('决策层')).toBeInTheDocument();
    expect(screen.getByText('AI 战略价值里程碑')).toBeInTheDocument();
    expect(
      screen.getByText('通过智能审核与优化，推动质量与效率双提升')
    ).toBeInTheDocument();
    expect(screen.getByText('高危风险消除率')).toBeInTheDocument();
    expect(screen.getByText('平均性能提升')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should refresh data when report statistics refresh event is emitted', async () => {
    sqleSuperRender(<StrategicInsight />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestStrategicValueSpy).toHaveBeenCalledTimes(1);

    act(() => {
      eventEmitter.emit(EmitterKey.Refresh_Report_Statistics);
    });
    await act(async () => jest.advanceTimersByTime(3300));

    expect(requestStrategicValueSpy).toHaveBeenCalledTimes(2);
  });

  it('should render fallback "-" when strategic insight data is empty', async () => {
    requestStrategicValueSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          code: 0,
          message: 'ok',
          data: {}
        }
      })
    );

    sqleSuperRender(<StrategicInsight />);
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });
});
