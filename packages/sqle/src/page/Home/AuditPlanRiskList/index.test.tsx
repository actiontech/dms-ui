import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import home from '../../../testUtils/mockApi/home';
import AuditPlanRiskList from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { authPlanRiskMockData } from '../../../testUtils/mockApi/home/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('page/Home/AuditPlanRiskList', () => {
  const customRender = () => {
    return superRender(
      <AuditPlanRiskList
        projectName={mockProjectInfo.projectName}
        projectID={mockProjectInfo.projectID}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    home.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render normal table', async () => {
    const request = home.getRiskAuditPlan();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('待处理扫描任务')).toBeInTheDocument();
    expect(
      screen.getByText('生成时间 2023-12-27 12:32:38')
    ).toBeInTheDocument();
    expect(screen.getByText('生成时间 -')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('test-risk')).toBeInTheDocument();

    expect(screen.getByText('生成时间 2023-12-27 12:32:38')).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/audit-plan/detail/${authPlanRiskMockData[0].audit_plan_name}/report/${authPlanRiskMockData[0].audit_plan_report_id}`
    );
    expect(screen.getByText('test-risk')).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/audit-plan/detail/${authPlanRiskMockData[0].audit_plan_name}`
    );
    expect(screen.getAllByText('-').length).toBe(2);

    fireEvent.click(getBySelector('.ant-btn'));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
  });

  it('render table with return error', async () => {
    const request = home.getRiskAuditPlan();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        code: 500,
        message: 'error'
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
