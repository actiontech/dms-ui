import { superRender } from '../../../../testUtils/customRender';
import DataSourceCount from '.';
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
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/ProjectOverview/DataSourceCount', () => {
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
    return superRender(<DataSourceCount />);
  };

  it('render data source count and check more data', async () => {
    const request = projectOverview.getInstanceHealth();
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('查看更多')).toBeInTheDocument();
    fireEvent.click(screen.getByText('查看更多'));
    expect(navigateSpy).toBeCalledWith(
      `/project/${mockProjectInfo.projectID}/db-services`
    );
  });

  it('render no data and refresh data source count', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = projectOverview.getInstanceHealth();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: []
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

  // it('show tooltip when mouse move', async () => {
  //   const request = projectOverview.getInstanceHealth();
  //   const { baseElement } = customRender();
  //   await act(async () =>
  //     EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
  //   );
  //   await act(async () => jest.advanceTimersByTime(3000));
  //   expect(request).toBeCalled();
  //   expect(baseElement).toMatchSnapshot();
  //   expect(getBySelector('canvas')).toBeInTheDocument();
  //   fireEvent.mouseMove(getBySelector('canvas'));
  //   await act(async () => jest.advanceTimersByTime(3000));
  //   expect(
  //     getBySelector('.tooltip-box-database-source-order')
  //   ).toBeInTheDocument();
  // });
});
