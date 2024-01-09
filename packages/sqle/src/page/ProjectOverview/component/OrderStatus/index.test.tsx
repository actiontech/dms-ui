import { superRender } from '../../../../testUtils/customRender';
import OrderStatus from '.';
import projectOverview from '../../../../testUtils/mockApi/projectOverview';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { useNavigate } from 'react-router-dom';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import eventEmitter from '../../../../utils/EventEmitter';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/ProjectOverview/OrderStatus', () => {
  const navigateSpy = jest.fn();

  beforeEach(() => {
    projectOverview.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => {
    return superRender(<OrderStatus />);
  };

  it('render order status and click create order', async () => {
    const request = projectOverview.getStatisticWorkflowStatus();
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('工单')).toBeInTheDocument();
    expect(screen.getByText('创建工单')).toBeInTheDocument();
    fireEvent.click(screen.getByText('创建工单'));
    expect(navigateSpy).toBeCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/order/create`
    );
  });

  it('render no data and refresh data', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = projectOverview.getStatisticWorkflowStatus();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: null
      })
    );
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    expect(eventEmitSpy).toBeCalledTimes(1);
    expect(eventEmitSpy).toBeCalledWith(EmitterKey.Refresh_Project_Overview);
  });

  it('no permission for create order', async () => {
    mockUseCurrentProject({ projectArchive: false });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
