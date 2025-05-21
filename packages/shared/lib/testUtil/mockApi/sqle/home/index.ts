import statistic from '../../../../api/sqle/service/statistic';
import workflow from '../../../../api/sqle/service/workflow';
import dashboard from '../../../../api/sqle/service/dashboard';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import {
  authPlanRiskMockData,
  dashboardMockData,
  workflowMockData
} from './data';

class MockHomeApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getRiskAuditPlan();
    this.getWorkflows();
    this.getDashboard();
  }

  public getRiskAuditPlan() {
    const spy = jest.spyOn(statistic, 'getRiskAuditPlanV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: authPlanRiskMockData
      })
    );
    return spy;
  }

  public getWorkflows() {
    const spy = jest.spyOn(workflow, 'getWorkflowsV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: workflowMockData
      })
    );
    return spy;
  }

  public getDashboard() {
    const spy = jest.spyOn(dashboard, 'getDashboardV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: dashboardMockData
      })
    );
    return spy;
  }
}

export default new MockHomeApi();
