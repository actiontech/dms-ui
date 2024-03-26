import { superRender } from '../../../../testUtils/customRender';
import ScanTask from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { ignoreAntdPlotsAttr } from '@actiontech/shared/lib/testUtil/common';
import { useNavigate } from 'react-router-dom';
import projectOverview from '../../../../testUtils/mockApi/projectOverview';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import eventEmitter from '../../../../utils/EventEmitter';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/ProjectOverview/ScanTask', () => {
  ignoreAntdPlotsAttr();

  const navigateSpy = jest.fn();

  beforeEach(() => {
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
    return superRender(<ScanTask />);
  };

  it('render scan task and create order', async () => {
    const request = projectOverview.getStatisticAuditPlan();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建扫描任务')).toBeInTheDocument();
    fireEvent.click(screen.getByText('创建扫描任务'));
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/audit-plan/create`
    );
  });

  it('render no permission for create order', async () => {
    mockUseCurrentProject({ projectArchive: false });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render error info', async () => {
    const request = projectOverview.getStatisticAuditPlan();
    const errorInfo = 'error message';
    const { baseElement } = customRender();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        code: 500,
        message: errorInfo
      })
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText(errorInfo)?.[0]).toBeInTheDocument();
  });

  it('render empty and refresh task', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = projectOverview.getStatisticAuditPlan();
    const { baseElement } = customRender();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: []
      })
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('刷新')?.[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('刷新')?.[0]);
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Project_Overview
    );
  });
});
