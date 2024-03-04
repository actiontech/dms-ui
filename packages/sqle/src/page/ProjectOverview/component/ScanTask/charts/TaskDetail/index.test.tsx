import { superRender } from '../../../../../../testUtils/customRender';
import TaskDetail, { ITaskDetail } from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { statisticAuditPlanData } from '../../../../../../testUtils/mockApi/projectOverview/data';

describe('page/ProjectOverview/TaskDetail', () => {
  const mockRefresh = jest.fn();

  const taskDetailProps = {
    apiLoading: false,
    errorInfo: '',
    dataLength: statisticAuditPlanData.length,
    refreshFuc: mockRefresh,
    dataSource: statisticAuditPlanData[0]
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (data?: ITaskDetail) => {
    return superRender(<TaskDetail {...taskDetailProps} {...data} />);
  };

  it('render task detail', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render empty and refresh', async () => {
    const { baseElement } = customRender({
      ...taskDetailProps,
      dataLength: 0,
      dataSource: {}
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('render error info', async () => {
    const errorInfo = 'error message';
    const { baseElement } = customRender({
      ...taskDetailProps,
      errorInfo
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText(errorInfo)).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    expect(mockRefresh).toHaveBeenCalled();
  });
});
