import SqlInsight from '../../../../api/sqle/service/SqlInsight';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import {
  mockSqlPerformanceInsightsData,
  mockSqlPerformanceInsightsRelatedSQLData
} from './data';

class MockSqlManageApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getSqlPerformanceInsights();
    this.getSqlPerformanceInsightsRelatedSQL();
    this.getSqlPerformanceInsightsRelatedTransaction();
  }

  public getSqlPerformanceInsights() {
    const spy = jest.spyOn(SqlInsight, 'GetSqlPerformanceInsights');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockSqlPerformanceInsightsData
      })
    );
    return spy;
  }

  public getSqlPerformanceInsightsRelatedSQL() {
    const spy = jest.spyOn(SqlInsight, 'GetSqlPerformanceInsightsRelatedSQL');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockSqlPerformanceInsightsRelatedSQLData
      })
    );
    return spy;
  }

  public getSqlPerformanceInsightsRelatedTransaction() {
    const spy = jest.spyOn(
      SqlInsight,
      'GetSqlPerformanceInsightsRelatedTransaction'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: []
      })
    );
    return spy;
  }
}

export default new MockSqlManageApi();
