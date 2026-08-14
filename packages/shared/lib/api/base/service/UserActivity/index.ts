/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListUserActivityDailyTrendParams,
  IListUserActivityDailyTrendReturn,
  IListUserActivityHourlyDistributionParams,
  IListUserActivityHourlyDistributionReturn,
  IListUserActivityModuleDistributionParams,
  IListUserActivityModuleDistributionReturn,
  IGetUserActivitySummaryParams,
  IGetUserActivitySummaryReturn,
  IListUserActivityUsersParams,
  IListUserActivityUsersReturn
} from './index.d';

class UserActivityService extends ServiceBase {
  public ListUserActivityDailyTrend(
    params: IListUserActivityDailyTrendParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListUserActivityDailyTrendReturn>(
      '/v1/dms/statistic/user_activity/daily_trend',
      paramsData,
      options
    );
  }

  public ListUserActivityHourlyDistribution(
    params: IListUserActivityHourlyDistributionParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListUserActivityHourlyDistributionReturn>(
      '/v1/dms/statistic/user_activity/hourly_distribution',
      paramsData,
      options
    );
  }

  public ListUserActivityModuleDistribution(
    params: IListUserActivityModuleDistributionParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListUserActivityModuleDistributionReturn>(
      '/v1/dms/statistic/user_activity/module_distribution',
      paramsData,
      options
    );
  }

  public GetUserActivitySummary(
    params: IGetUserActivitySummaryParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserActivitySummaryReturn>(
      '/v1/dms/statistic/user_activity/summary',
      paramsData,
      options
    );
  }

  public ListUserActivityUsers(
    params: IListUserActivityUsersParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListUserActivityUsersReturn>(
      '/v1/dms/statistic/user_activity/users',
      paramsData,
      options
    );
  }
}

export default new UserActivityService();
