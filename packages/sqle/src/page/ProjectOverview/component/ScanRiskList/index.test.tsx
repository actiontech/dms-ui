import { sqleSuperRender } from '../../../../testUtils/superRender';
import ScanRiskList from '.';
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
import { riskAuditPlanData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/projectOverview/data';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/ProjectOverview/ScanRiskList', () => {
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
    return sqleSuperRender(<ScanRiskList />);
  };

  it('render scan risk list and check more data', async () => {
    const request = projectOverview.getRiskAuditPlan();
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('扫描任务报告')).toBeInTheDocument();
    expect(screen.getByText('时间')).toBeInTheDocument();
    expect(getAllBySelector('a').length).toBe(2);
    expect(getAllBySelector('a')?.[0]).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/audit-plan/detail/${riskAuditPlanData[0].audit_plan_name}/report/${riskAuditPlanData[0].audit_plan_report_id}`
    );
    expect(getAllBySelector('a')?.[1]).toHaveAttribute(
      'href',
      `/project/${mockProjectInfo.projectID}/audit-plan/detail/${riskAuditPlanData[0].audit_plan_name}`
    );
    expect(screen.getByText('查看更多')).toBeInTheDocument();
    fireEvent.click(screen.getByText('查看更多'));
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/audit-plan`
    );
  });

  it('request failed', async () => {
    const request = projectOverview.getRiskAuditPlan();
    request.mockImplementation(() => Promise.reject('error'));
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('render no data and refresh list', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = projectOverview.getRiskAuditPlan();
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
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Project_Overview
    );
  });
});
