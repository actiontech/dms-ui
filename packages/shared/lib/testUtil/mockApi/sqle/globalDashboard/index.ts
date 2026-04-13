import GlobalDashboard from '../../../../api/sqle/service/GlobalDashboard';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import {
  mockGlobalAccountListData,
  mockGlobalAccountStatisticsData,
  mockGlobalSqlManageStatisticsData,
  mockGlobalSqlManageTaskListData,
  mockGlobalWorkflowListData,
  mockGlobalWorkflowStatisticsData
} from './data';

class MockGlobalDashboardApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getGlobalAccountStatistics();
    this.getGlobalAccountList();
    this.getGlobalWorkflowStatistics();
    this.getGlobalWorkflowList();
    this.getGlobalSqlManageStatistics();
    this.getGlobalSqlManageTaskList();
  }

  public getGlobalAccountStatistics() {
    const spy = jest.spyOn(GlobalDashboard, 'GetGlobalAccountStatisticsV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGlobalAccountStatisticsData
      })
    );
    return spy;
  }

  public getGlobalAccountList() {
    const spy = jest.spyOn(GlobalDashboard, 'GetGlobalAccountListV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGlobalAccountListData,
        total_nums: mockGlobalAccountListData.accounts?.length ?? 0
      })
    );
    return spy;
  }

  public getGlobalWorkflowStatistics() {
    const spy = jest.spyOn(GlobalDashboard, 'GetGlobalWorkflowStatisticsV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGlobalWorkflowStatisticsData
      })
    );
    return spy;
  }

  public getGlobalWorkflowList() {
    const spy = jest.spyOn(GlobalDashboard, 'GetGlobalWorkflowListV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGlobalWorkflowListData
      })
    );
    return spy;
  }

  public getGlobalSqlManageStatistics() {
    const spy = jest.spyOn(GlobalDashboard, 'GetGlobalSqlManageStatisticsV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGlobalSqlManageStatisticsData
      })
    );
    return spy;
  }

  public getGlobalSqlManageTaskList() {
    const spy = jest.spyOn(GlobalDashboard, 'GetGlobalSqlManageTaskListV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGlobalSqlManageTaskListData,
        total_nums: mockGlobalSqlManageTaskListData.length
      })
    );
    return spy;
  }
}

export default new MockGlobalDashboardApi();
