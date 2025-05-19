import statistic from '../../../../api/sqle/service/statistic';
import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import {
  instanceHealthData,
  projectScoreData,
  riskAuditPlanData,
  statisticAuditPlanData,
  statisticRiskWorkflowData,
  statisticWorkflowStatusData,
  statisticsAuditedSQLData
} from './data';

class MockProjectManageApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getInstanceHealth();
    this.getStatisticRiskWorkflow();
    this.getStatisticsAuditedSQL();
  }

  public getInstanceHealth() {
    const spy = jest.spyOn(statistic, 'GetInstanceHealthV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: instanceHealthData
      })
    );
    return spy;
  }

  public getStatisticRiskWorkflow() {
    const spy = jest.spyOn(statistic, 'statisticRiskWorkflowV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: statisticRiskWorkflowData
      })
    );
    return spy;
  }

  public getStatisticWorkflowStatus() {
    const spy = jest.spyOn(statistic, 'statisticWorkflowStatusV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: statisticWorkflowStatusData
      })
    );
    return spy;
  }

  public getProjectScore() {
    const spy = jest.spyOn(statistic, 'GetProjectScoreV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: projectScoreData
      })
    );
    return spy;
  }

  public getRiskAuditPlan() {
    const spy = jest.spyOn(statistic, 'getRiskAuditPlanV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: riskAuditPlanData
      })
    );
    return spy;
  }

  public getStatisticAuditPlan() {
    const spy = jest.spyOn(statistic, 'statisticAuditPlanV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: statisticAuditPlanData
      })
    );
    return spy;
  }

  public getStatisticsAuditedSQL() {
    const spy = jest.spyOn(statistic, 'statisticsAuditedSQLV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: statisticsAuditedSQLData,
        risk_rate: 10
      })
    );
    return spy;
  }
}

export default new MockProjectManageApi();
