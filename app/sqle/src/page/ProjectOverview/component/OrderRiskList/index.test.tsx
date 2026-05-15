import { sqleSuperRender } from '../../../../testUtils/superRender';
import OrderRiskList from '.';
import projectOverview from '@actiontech/shared/lib/testUtil/mockApi/sqle/projectOverview';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { useNavigate } from 'react-router-dom';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import eventEmitter from '../../../../utils/EventEmitter';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { statisticRiskWorkflowData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/projectOverview/data';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/ProjectOverview/OrderRiskList', () => {
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
    return sqleSuperRender(<OrderRiskList />);
  };

  it('render order risk list and check more data', async () => {
    const request = projectOverview.getStatisticRiskWorkflow();
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('工单')).toBeInTheDocument();
    expect(screen.getByText('创建人')).toBeInTheDocument();
    expect(getAllBySelector('a').length).toBe(2);
    expect(getAllBySelector('a')?.[0]).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/exec-workflow/${statisticRiskWorkflowData[0].workflow_id}`
    );
    expect(screen.getByText('查看更多')).toBeInTheDocument();
    fireEvent.click(screen.getByText('查看更多'));
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/exec-workflow`
    );
  });

  it('render no data and refresh list', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = projectOverview.getStatisticRiskWorkflow();
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
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.getByText('刷 新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷 新'));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Project_Overview
    );
  });
});
