import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import WorkflowStatCards from '..';
import { baseSuperRender } from '../../../../testUtils/superRender';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { GetGlobalWorkflowListV2FilterCardEnum } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';

jest.mock('@actiontech/shared', () => ({
  ...jest.requireActual('@actiontech/shared'),
  useTypedNavigate: jest.fn()
}));

describe('WorkflowStatCards', () => {
  const navigateSpy = jest.fn();
  let getGlobalWorkflowStatisticsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getGlobalWorkflowStatisticsSpy =
      sqleMockApi.globalDashboard.getGlobalWorkflowStatistics();
    (useTypedNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render loading state on initial render', () => {
    const { baseElement } = baseSuperRender(<WorkflowStatCards />);
    expect(baseElement).toMatchSnapshot();
    expect(getGlobalWorkflowStatisticsSpy).toHaveBeenCalledTimes(1);
  });

  it('should render workflow statistics after data loaded', async () => {
    const { baseElement } = baseSuperRender(<WorkflowStatCards />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('工单概览')).toBeInTheDocument();
    expect(screen.getByText('跟踪与您相关的工单进度')).toBeInTheDocument();
    expect(
      screen.getByText('查看工单管理', { exact: false })
    ).toBeInTheDocument();

    expect(screen.getByText('待我处理')).toBeInTheDocument();
    expect(screen.getByText('需立即行动')).toBeInTheDocument();
    expect(screen.getByText('我发起的')).toBeInTheDocument();
    expect(screen.getByText('关注进度')).toBeInTheDocument();
    expect(screen.getByText('已归档')).toBeInTheDocument();
    expect(screen.getByText('已完结任务')).toBeInTheDocument();
    expect(screen.getByText('查看全部')).toBeInTheDocument();
    expect(screen.getByText('当前可见范围')).toBeInTheDocument();

    // 验证统计数字（mock 数据：8 / 5 / 12 / 25）
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('should navigate to workflow management when clicking section link', async () => {
    baseSuperRender(<WorkflowStatCards />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('查看工单管理', { exact: false }));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index,
      { queries: { tab: 'workflow' } }
    );
  });

  it('should navigate with pending_for_me filter when clicking "待我处理" card', async () => {
    baseSuperRender(<WorkflowStatCards />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('待我处理'));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index,
      {
        queries: {
          tab: 'workflow',
          card: GetGlobalWorkflowListV2FilterCardEnum.pending_for_me
        }
      }
    );
  });

  it('should navigate with initiated_by_me filter when clicking "我发起的" card', async () => {
    baseSuperRender(<WorkflowStatCards />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('我发起的'));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index,
      {
        queries: {
          tab: 'workflow',
          card: GetGlobalWorkflowListV2FilterCardEnum.initiated_by_me
        }
      }
    );
  });

  it('should navigate with archived filter when clicking "已归档" card', async () => {
    baseSuperRender(<WorkflowStatCards />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('已归档'));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index,
      {
        queries: {
          tab: 'workflow',
          card: GetGlobalWorkflowListV2FilterCardEnum.archived
        }
      }
    );
  });

  it('should navigate with view_all filter when clicking "查看全部" card', async () => {
    baseSuperRender(<WorkflowStatCards />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('查看全部'));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index,
      {
        queries: {
          tab: 'workflow',
          card: GetGlobalWorkflowListV2FilterCardEnum.view_all
        }
      }
    );
  });
});
