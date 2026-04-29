import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import WorkflowPanel from '..';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi/common';
import { GlobalWorkflowListItemWorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockGlobalWorkflowStatisticsData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/globalDashboard/data';

describe('GlobalDashboard/WorkflowPanel', () => {
  const openSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());
  let getGlobalWorkflowStatisticsSpy: jest.SpyInstance;
  let getGlobalWorkflowListSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    getGlobalWorkflowStatisticsSpy =
      sqleMockApi.globalDashboard.getGlobalWorkflowStatistics();
    getGlobalWorkflowListSpy =
      sqleMockApi.globalDashboard.getGlobalWorkflowList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  afterAll(() => {
    openSpy.mockRestore();
  });

  it('should render workflow panel and request data', async () => {
    const { baseElement } = superRender(<WorkflowPanel />);

    expect(getGlobalWorkflowStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalWorkflowListSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('待我处理')).toBeInTheDocument();
    expect(screen.getByText('我发起的')).toBeInTheDocument();
    expect(screen.getByText('已归档')).toBeInTheDocument();
    expect(screen.getByText('SQL Release Workflow')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should request initiated list when initiated card clicked', async () => {
    superRender(<WorkflowPanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('我发起的'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getGlobalWorkflowListSpy).toHaveBeenCalledTimes(2);
    expect(getGlobalWorkflowListSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filter_card: 'initiated_by_me'
      })
    );
  });

  it('should open workflow detail page when clicking action button', async () => {
    superRender(<WorkflowPanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('去处理')[0]);

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('/sqle/project/1/exec-workflow/workflow-1'),
      '_blank'
    );
  });

  it('should open data export workflow page', async () => {
    superRender(<WorkflowPanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('去处理')[1]);

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('/data/export/'),
      '_blank'
    );
  });

  it('should show warning when workflow row has no project uid', async () => {
    getGlobalWorkflowListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          total_nums: 1,
          has_more: false,
          next_cursor: '',
          workflows: [
            {
              workflow_id: 'workflow-no-project',
              workflow_name: 'No Project Workflow',
              workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release
            }
          ]
        }
      })
    );
    superRender(<WorkflowPanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('去处理'));

    expect(screen.queryByText('缺少项目信息，无法跳转')).toBeInTheDocument();
  });

  it('should refresh workflow list when clicking search icon', async () => {
    superRender(<WorkflowPanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    const searchInput = document.getElementById(
      'actiontech-table-search-input'
    );
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput as Element, { target: { value: 'workflow' } });
    fireEvent.click(document.querySelector('.custom-icon-search') as Element);
    await act(async () => jest.advanceTimersByTime(0));

    expect(getGlobalWorkflowListSpy).toHaveBeenCalledTimes(2);
    expect(getGlobalWorkflowListSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ keyword: 'workflow' })
    );
  });

  it('should handle workflow list request error', async () => {
    getGlobalWorkflowListSpy.mockImplementation(() =>
      createSpyErrorResponse('workflow error')
    );
    superRender(<WorkflowPanel />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getGlobalWorkflowListSpy).toHaveBeenCalledTimes(1);
  });

  it('should update workflow type filter and then clear to all', async () => {
    superRender(<WorkflowPanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(
      document.querySelector(
        '.custom-segmented-filter-wrapper .ant-segmented-item-label[title="SQL上线工单"]'
      ) as Element
    );
    await act(async () => jest.advanceTimersByTime(0));
    expect(getGlobalWorkflowListSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ workflow_type: 'sql_release' })
    );

    fireEvent.click(
      document.querySelector(
        '.custom-segmented-filter-wrapper .ant-segmented-item-label[title="全部"]'
      ) as Element
    );
    await act(async () => jest.advanceTimersByTime(0));

    const lastCallArgs = (getGlobalWorkflowListSpy as jest.Mock).mock.calls[
      (getGlobalWorkflowListSpy as jest.Mock).mock.calls.length - 1
    ][0];
    expect(lastCallArgs).not.toHaveProperty('workflow_type');
  });

  it('should keep cursor when requesting page greater than one', async () => {
    getGlobalWorkflowListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          total_nums: 30,
          has_more: true,
          next_cursor: 'cursor-page-1',
          workflows: [
            {
              workflow_id: 'workflow-page',
              workflow_name: 'Workflow Page',
              workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.sql_release
            }
          ]
        }
      })
    );

    superRender(<WorkflowPanel />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(
      document.querySelector('.ant-pagination-item-2') as Element
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getGlobalWorkflowListSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page_index: 2,
        cursor: 'cursor-page-1'
      })
    );
  });

  describe('view_all card', () => {
    const viewAllTestCases = [
      {
        name: 'should render four stat cards with the fourth being "查看全部"',
        action: async () => {
          superRender(<WorkflowPanel />);
          await act(async () => jest.advanceTimersByTime(3000));
        },
        assertion: () => {
          expect(screen.getByText('待我处理')).toBeInTheDocument();
          expect(screen.getByText('我发起的')).toBeInTheDocument();
          expect(screen.getByText('已归档')).toBeInTheDocument();
          expect(screen.getByText('查看全部')).toBeInTheDocument();

          const statCards = document.querySelectorAll('.stat-card-title');
          expect(statCards).toHaveLength(4);
          expect(statCards[3].textContent).toBe('查看全部');
        }
      },
      {
        name: 'should request list with filter_card=view_all when clicking "查看全部" card',
        action: async () => {
          superRender(<WorkflowPanel />);
          await act(async () => jest.advanceTimersByTime(3000));

          fireEvent.click(screen.getByText('查看全部'));
          await act(async () => jest.advanceTimersByTime(0));
        },
        assertion: () => {
          expect(getGlobalWorkflowListSpy).toHaveBeenLastCalledWith(
            expect.objectContaining({
              filter_card: 'view_all'
            })
          );
        }
      },
      {
        name: 'should not have "查看全部" card selected by default (pending_for_me is default)',
        action: async () => {
          superRender(<WorkflowPanel />);
          await act(async () => jest.advanceTimersByTime(3000));
        },
        assertion: () => {
          expect(getGlobalWorkflowListSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              filter_card: 'pending_for_me'
            })
          );
        }
      },
      {
        name: 'should display view_all_count value on the "查看全部" card',
        action: async () => {
          superRender(<WorkflowPanel />);
          await act(async () => jest.advanceTimersByTime(3000));
        },
        assertion: () => {
          const expectedCount = String(
            mockGlobalWorkflowStatisticsData.view_all_count
          );
          const statCountElements =
            document.querySelectorAll('.stat-card-count');
          expect(statCountElements[3].textContent).toBe(expectedCount);
        }
      }
    ];

    viewAllTestCases.forEach(({ name, action, assertion }) => {
      it(name, async () => {
        await action();
        assertion();
      });
    });
  });
});
