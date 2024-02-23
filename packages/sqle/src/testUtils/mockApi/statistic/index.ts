import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import {
  InstancesTypePercentData,
  LicenseUsageData,
  SqlAverageExecutionTimeData,
  WorkflowCountData,
  WorkflowCreatedCountEachDayData,
  WorkflowPercentCountedByInstanceTypeData,
  WorkflowRejectedPercentGroupByCreatorData,
  WorkflowStatusCountData
} from './data';

class StatisticAPI implements MockSpyApy {
  public mockAllApi(): void {
    this.getWorkflowCount();
    this.getWorkflowDurationOfWaitingForAudit();
    this.getWorkflowAuditPassPercent();
    this.getWorkflowRejectedPercentGroupByCreator();
    this.getSqlAverageExecutionTime();
    this.getInstancesTypePercent();
    this.getWorkflowPercentCountedByInstanceType();
    this.getLicenseUsage();
    this.getWorkflowCreatedCountEachDay();
    this.getWorkflowStatusCount();
  }

  public getWorkflowCount() {
    const spy = jest.spyOn(statistic, 'getWorkflowCountV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: WorkflowCountData
      })
    );
    return spy;
  }

  public getWorkflowDurationOfWaitingForAudit() {
    const spy = jest.spyOn(statistic, 'getWorkflowDurationOfWaitingForAuditV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          minutes: 20
        }
      })
    );
    return spy;
  }

  public getWorkflowAuditPassPercent() {
    const spy = jest.spyOn(statistic, 'getWorkflowAuditPassPercentV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          audit_pass_percent: 90
        }
      })
    );
    return spy;
  }

  public getWorkflowRejectedPercentGroupByCreator() {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowRejectedPercentGroupByCreatorV1'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: WorkflowRejectedPercentGroupByCreatorData
      })
    );
    return spy;
  }

  public getSqlAverageExecutionTime() {
    const spy = jest.spyOn(statistic, 'getSqlAverageExecutionTimeV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: SqlAverageExecutionTimeData
      })
    );
    return spy;
  }

  public getInstancesTypePercent() {
    const spy = jest.spyOn(statistic, 'getInstancesTypePercentV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: InstancesTypePercentData
      })
    );
    return spy;
  }

  public getWorkflowPercentCountedByInstanceType() {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowPercentCountedByInstanceTypeV1'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          workflow_total_num: WorkflowPercentCountedByInstanceTypeData.length,
          workflow_percents: WorkflowPercentCountedByInstanceTypeData
        }
      })
    );
    return spy;
  }

  public getLicenseUsage() {
    const spy = jest.spyOn(statistic, 'getLicenseUsageV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: LicenseUsageData
      })
    );
    return spy;
  }

  public getWorkflowCreatedCountEachDay() {
    const spy = jest.spyOn(statistic, 'getWorkflowCreatedCountEachDayV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: { samples: WorkflowCreatedCountEachDayData }
      })
    );
    return spy;
  }

  public getWorkflowStatusCount() {
    const spy = jest.spyOn(statistic, 'getWorkflowStatusCountV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: WorkflowStatusCountData
      })
    );
    return spy;
  }
}

export default new StatisticAPI();
