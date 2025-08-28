import sqlOptimization from '../../../../api/sqle/service/sql_optimization';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import {
  sqlOptimizationRecordsMockData,
  createOptimizationResMockData,
  optimizationRecordMockData,
  optimizationRecordSqlMockData,
  optimizationDetailMockData,
  performanceImproveMockData,
  optimizationRecordOverviewMockData
} from './data';

class SqlOptimization implements MockSpyApy {
  public mockAllApi(): void {
    this.getOptimizationRecords();
    this.optimizeSQLReq();
    this.getOptimizationRecordReq();
    this.getOptimizationSQLs();
    this.getOptimizationReq();
    this.getDBPerformanceImproveOverview();
    this.getOptimizationOverview();
  }

  public getOptimizationRecords() {
    const spy = jest.spyOn(sqlOptimization, 'GetOptimizationRecordsV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: sqlOptimizationRecordsMockData,
        total_nums: sqlOptimizationRecordsMockData.length
      })
    );
    return spy;
  }

  public optimizeSQLReq() {
    const spy = jest.spyOn(sqlOptimization, 'SQLOptimizeV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: createOptimizationResMockData })
    );
    return spy;
  }

  public getOptimizationRecordReq() {
    const spy = jest.spyOn(sqlOptimization, 'GetOptimizationRecordReq');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: optimizationRecordMockData })
    );
    return spy;
  }

  public getOptimizationSQLs() {
    const spy = jest.spyOn(sqlOptimization, 'getOptimizationSQLs');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: optimizationRecordSqlMockData,
        total_nums: optimizationRecordSqlMockData.length
      })
    );
    return spy;
  }

  public getOptimizationReq() {
    const spy = jest.spyOn(sqlOptimization, 'GetOptimizationReq');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: optimizationDetailMockData
      })
    );
    return spy;
  }

  public getDBPerformanceImproveOverview() {
    const spy = jest.spyOn(sqlOptimization, 'getDBPerformanceImproveOverview');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: performanceImproveMockData
      })
    );
    return spy;
  }

  public getOptimizationOverview() {
    const spy = jest.spyOn(sqlOptimization, 'getOptimizationOverview');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: optimizationRecordOverviewMockData
      })
    );
    return spy;
  }
}

export default new SqlOptimization();
