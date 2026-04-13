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
import { message } from 'antd';
import { GlobalWorkflowListItemWorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('GlobalDashboard/WorkflowPanel', () => {
  const openSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());
  let getGlobalWorkflowStatisticsSpy: jest.SpyInstance;
  let getGlobalWorkflowListSpy: jest.SpyInstance;
  const warningSpy = jest
    .spyOn(message, 'warning')
    .mockImplementation(jest.fn());

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
    warningSpy.mockRestore();
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

    expect(warningSpy).toHaveBeenCalledWith('缺少项目信息，无法跳转');
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
});
