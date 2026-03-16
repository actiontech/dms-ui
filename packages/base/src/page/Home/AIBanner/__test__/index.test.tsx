import { act, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import statistic from '@actiontech/shared/lib/testUtil/mockApi/sqle/statistic';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { mockUseRecentlyOpenedProjects } from '../../../Nav/SideMenu/testUtils/mockUseRecentlyOpenedProjects';
import { baseSuperRender } from '../../../../testUtils/superRender';
import AIBanner from '..';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

const mockMessageInfo = jest.fn();
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    ...jest.requireActual('antd').message,
    info: (...args: unknown[]) => mockMessageInfo(...args)
  }
}));

describe('test base/home/AIBanner', () => {
  const navigateSpy = jest.fn();
  const mockedUseNavigate = useNavigate as jest.Mock;
  let requestBannerSpy: jest.SpyInstance;
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockMessageInfo.mockClear();
    requestBannerSpy = statistic.getAIHubBanner();
    mockedUseNavigate.mockImplementation(() => navigateSpy);
    mockUseCurrentUser();
    mockUseRecentlyOpenedProjects({ currentProjectID: '1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot and render metrics and actions by modules', async () => {
    const { baseElement } = baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('AI治理效能洞察')).toBeInTheDocument();
    expect(screen.getByText('风险拦截')).toBeInTheDocument();
    expect(screen.getByText('性能优化')).toBeInTheDocument();
    expect(screen.getByText('AI 性能引擎')).toBeInTheDocument();
    expect(screen.getByText('AI 智能修正')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();
    expect(screen.getByText('中')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should navigate to report statistics when clicked "view full report"', async () => {
    baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('查看完整报告')).toBeInTheDocument();
    fireEvent.click(screen.getByText('查看完整报告'));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `${ROUTE_PATHS.SQLE.REPORT_STATISTICS.index.path}?tab=ai-governance`
    );
  });

  it('should navigate to related page when current project id exists', async () => {
    mockUseRecentlyOpenedProjects({ currentProjectID: '1' });

    baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('AI 性能引擎')).toBeInTheDocument();
    fireEvent.click(screen.getByText('AI 性能引擎'));

    expect(navigateSpy).toHaveBeenCalledWith(
      '/sqle/project/1/sql-audit/create-optimization'
    );
  });

  it('should open project selector modal when current project id is undefined', async () => {
    mockUseRecentlyOpenedProjects({ currentProjectID: '' });

    baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('AI 性能引擎')).toBeInTheDocument();
    expect(screen.queryByText('选择项目')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('AI 性能引擎'));

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(screen.getByText('选择项目')).toBeInTheDocument();
  });

  it('should render no metric and action buttons when api returns empty modules', async () => {
    requestBannerSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          modules: []
        }
      })
    );

    baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('查看完整报告')).toBeInTheDocument();
    expect(screen.queryByText('风险拦截')).not.toBeInTheDocument();
    expect(screen.queryByText('性能优化')).not.toBeInTheDocument();
    expect(screen.queryByText('AI 性能引擎')).not.toBeInTheDocument();
    expect(screen.queryByText('AI 智能修正')).not.toBeInTheDocument();
  });

  it('should show paid feature prompt and not navigate when view full report clicked with all modules disabled', async () => {
    requestBannerSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          modules: [
            { ai_module_type: 'performance_engine', is_enabled: false },
            { ai_module_type: 'smart_correction', is_enabled: false }
          ]
        }
      })
    );

    baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    fireEvent.click(screen.getByText('查看完整报告'));

    expect(mockMessageInfo).toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should show paid feature prompt when AI performance engine clicked with module disabled', async () => {
    requestBannerSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          modules: [
            {
              ai_module_type: 'performance_engine',
              is_enabled: false,
              banner_cards: [{ need_display: true }]
            },
            {
              ai_module_type: 'smart_correction',
              is_enabled: true,
              banner_cards: [{ need_display: true }]
            }
          ]
        }
      })
    );

    baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    fireEvent.click(screen.getByText('AI 性能引擎'));

    expect(mockMessageInfo).toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should show paid feature prompt when AI smart correction clicked with module disabled', async () => {
    requestBannerSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          modules: [
            {
              ai_module_type: 'performance_engine',
              is_enabled: true,
              banner_cards: [{ need_display: true }]
            },
            {
              ai_module_type: 'smart_correction',
              is_enabled: false,
              banner_cards: [{ need_display: true }]
            }
          ]
        }
      })
    );

    baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    fireEvent.click(screen.getByText('AI 智能修正'));

    expect(mockMessageInfo).toHaveBeenCalled();
    expect(screen.queryByText('重写详情')).not.toBeInTheDocument();
  });

  it('should open SqlRewrittenExampleDrawer when AI smart correction clicked', async () => {
    baseSuperRender(<AIBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.queryByText('重写详情')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('AI 智能修正'));

    expect(screen.getByText('重写详情')).toBeInTheDocument();
  });
});
