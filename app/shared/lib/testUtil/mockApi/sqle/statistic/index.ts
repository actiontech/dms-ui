import { MockSpyApy, createSpySuccessResponse } from '../../common';
import statistic from '../../../../api/sqle/service/statistic';
import {
  AIHubExecutionData,
  AIHubManagementViewData,
  AIHubStrategicValueData,
  AIHubBannerData,
  InstancesTypePercentData,
  LicenseUsageData,
  SqlAverageExecutionTimeData,
  WorkflowCountData,
  WorkflowCreatedCountEachDayData,
  WorkflowPercentCountedByInstanceTypeData,
  WorkflowRejectedPercentGroupByCreatorData,
  WorkflowStatusCountData
} from './data';
import Configuration from '../../../../api/base/service/Configuration';
import { AiHubService } from '../../../../api/sqle';

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
    this.getAIHubExecutionData();
    this.getAIHubManagementView();
    this.getAIHubStrategicValue();
    this.getAIHubBanner();
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
    const spy = jest.spyOn(Configuration, 'GetLicenseUsage');
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

  public getAIHubExecutionData() {
    const spy = jest.spyOn(AiHubService, 'GetAIHubExecutionData');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AIHubExecutionData,
        total_nums: AIHubExecutionData.length
      })
    );
    return spy;
  }

  public getAIHubManagementView() {
    const spy = jest.spyOn(AiHubService, 'GetAIHubManagementView');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AIHubManagementViewData
      })
    );
    return spy;
  }

  public getAIHubStrategicValue() {
    const spy = jest.spyOn(AiHubService, 'GetAIHubStrategicValue');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AIHubStrategicValueData
      })
    );
    return spy;
  }

  public getAIHubBanner() {
    const spy = jest.spyOn(AiHubService, 'GetAIHubBanner');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AIHubBannerData
      })
    );
    return spy;
  }
}

export default new StatisticAPI();
