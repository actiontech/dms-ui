import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AIBanner from '..';
import { baseSuperRender } from '../../../../testUtils/superRender';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { mockUseRecentlyOpenedProjects } from '../../../Nav/SideMenu/testUtils/mockUseRecentlyOpenedProjects';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';

jest.mock('@actiontech/shared', () => ({
  ...jest.requireActual('@actiontech/shared'),
  useTypedNavigate: jest.fn()
}));

describe('AIBanner', () => {
  const navigateSpy = jest.fn();
  let getAIHubBannerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getAIHubBannerSpy = sqleMockApi.statistic.getAIHubBanner();
    (useTypedNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseCurrentUser();
    mockUseRecentlyOpenedProjects({ currentProjectID: '1' });
    mockUsePermission(
      { checkPagePermission: jest.fn().mockReturnValue(true) },
      { useSpyOnMockHooks: true }
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render loading state on initial render', () => {
    const { baseElement } = baseSuperRender(<AIBanner />);
    expect(baseElement).toMatchSnapshot();
    expect(getAIHubBannerSpy).toHaveBeenCalledTimes(1);
  });

  it('should render AI banner after data loaded', async () => {
    const { baseElement } = baseSuperRender(<AIBanner />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('AI治理效能洞察')).toBeInTheDocument();
    expect(
      screen.getByText('基于大模型实时监控规范与性能, AI驱动全链路质量闭环。')
    ).toBeInTheDocument();
    expect(screen.getByText('查看完整报告')).toBeInTheDocument();
    expect(screen.getByText('风险拦截')).toBeInTheDocument();
    expect(screen.getByText('性能优化')).toBeInTheDocument();
    expect(screen.getByText('AI 性能引擎')).toBeInTheDocument();
    expect(screen.getByText('AI 智能修正')).toBeInTheDocument();
  });

  it('should navigate to report statistics when clicking "查看完整报告"', async () => {
    baseSuperRender(<AIBanner />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('查看完整报告'));

    expect(navigateSpy).toHaveBeenCalledWith(
      ROUTE_PATHS.SQLE.REPORT_STATISTICS.index,
      { queries: { tab: 'ai-governance' } }
    );
  });

  it('should navigate to SQL optimization when clicking "AI 性能引擎" with current project', async () => {
    baseSuperRender(<AIBanner />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('AI 性能引擎'));

    expect(navigateSpy).toHaveBeenCalledWith(
      ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.create,
      { params: { projectID: '1' } }
    );
  });

  it('should trigger smart correction handler when clicking "AI 智能修正"', async () => {
    baseSuperRender(<AIBanner />);

    await act(async () => jest.advanceTimersByTime(3000));

    // 点击 AI 智能修正时，不会触发页面跳转（与 AI 性能引擎不同）
    expect(() => fireEvent.click(screen.getByText('AI 智能修正'))).not.toThrow();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should show paid feature prompt when all modules are disabled', async () => {
    getAIHubBannerSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            modules: [
              {
                ai_module_type: 'performance_engine',
                is_enabled: false,
                banner_cards: [{ need_display: true }]
              },
              {
                ai_module_type: 'smart_correction',
                is_enabled: false,
                banner_cards: [{ need_display: true }]
              }
            ]
          }
        }
      })
    );

    baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('查看完整报告'));

    expect(
      screen.getByText(
        '当前功能为付费增值模块，请联系商务获取详细信息'
      )
    ).toBeInTheDocument();
  });

  it('should refresh AI banner data when DMS_Reload_Initial_Data event is emitted', async () => {
    baseSuperRender(<AIBanner />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAIHubBannerSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      EventEmitter.emit(EmitterKey.DMS_Reload_Initial_Data);
      await jest.advanceTimersByTime(3000);
    });

    expect(getAIHubBannerSpy).toHaveBeenCalledTimes(2);
  });
});
