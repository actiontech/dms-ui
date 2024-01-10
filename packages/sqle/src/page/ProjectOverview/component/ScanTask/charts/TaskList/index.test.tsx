import { superRender } from '../../../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { statisticAuditPlanData } from '../../../../../../testUtils/mockApi/projectOverview/data';
import TaskList, { ITaskList } from './index';
import { ignoreAntdPlotsAttr } from '@actiontech/shared/lib/testUtil/common';

describe('page/ProjectOverview/TaskList', () => {
  ignoreAntdPlotsAttr();

  const mockRefresh = jest.fn();
  const taskListProps = {
    apiLoading: false,
    errorInfo: '',
    dataLength: 1,
    refreshFuc: mockRefresh,
    onReady: jest.fn(),
    dataSource: [{ ...statisticAuditPlanData[0] }]
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

  const customRender = (data?: ITaskList) => {
    return superRender(<TaskList {...taskListProps} {...data} />);
  };

  it('render task list', async () => {
    const { baseElement } = customRender({ ...taskListProps });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render task list more than 11', async () => {
    const { baseElement } = customRender({
      ...taskListProps,
      dataLength: statisticAuditPlanData.length,
      dataSource: statisticAuditPlanData
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render empty and refresh', async () => {
    const { baseElement } = customRender({
      ...taskListProps,
      dataLength: 0,
      dataSource: []
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    expect(mockRefresh).toBeCalled();
  });

  it('render error info', async () => {
    const errorInfo = 'error message';
    const { baseElement } = customRender({
      ...taskListProps,
      errorInfo
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText(errorInfo)).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    expect(mockRefresh).toBeCalled();
  });
});
