import { createSpySuccessResponse, MockSpyApy } from '../../common';
import { UserActivityService } from '../../../../api/base';
import {
  mockUserActivityDailyTrend,
  mockUserActivityHourlyDistribution,
  mockUserActivityModuleDistribution,
  mockUserActivitySummary,
  mockUserActivityUsers
} from './data';

class MockUserActivityApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getUserActivitySummaryV1();
    this.getUserActivityDailyTrendV1();
    this.getUserActivityModuleDistributionV1();
    this.getUserActivityHourlyDistributionV1();
    this.getUserActivityUsersV1();
  }

  public getUserActivitySummaryV1() {
    const spy = jest.spyOn(UserActivityService, 'GetUserActivitySummary');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockUserActivitySummary })
    );
    return spy;
  }

  public getUserActivityDailyTrendV1() {
    const spy = jest.spyOn(UserActivityService, 'ListUserActivityDailyTrend');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockUserActivityDailyTrend })
    );
    return spy;
  }

  public getUserActivityModuleDistributionV1() {
    const spy = jest.spyOn(
      UserActivityService,
      'ListUserActivityModuleDistribution'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockUserActivityModuleDistribution })
    );
    return spy;
  }

  public getUserActivityHourlyDistributionV1() {
    const spy = jest.spyOn(
      UserActivityService,
      'ListUserActivityHourlyDistribution'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockUserActivityHourlyDistribution })
    );
    return spy;
  }

  public getUserActivityUsersV1() {
    const spy = jest.spyOn(UserActivityService, 'ListUserActivityUsers');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockUserActivityUsers,
        total_nums: mockUserActivityUsers.length
      })
    );
    return spy;
  }
}

export default new MockUserActivityApi();
