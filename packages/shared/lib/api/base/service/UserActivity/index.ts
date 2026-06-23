/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetUserActivityDailyTrendV1Params,
  IGetUserActivityDailyTrendV1Return,
  IGetUserActivityHourlyDistributionV1Params,
  IGetUserActivityHourlyDistributionV1Return,
  IGetUserActivityModuleDistributionV1Params,
  IGetUserActivityModuleDistributionV1Return,
  IGetUserActivitySummaryV1Params,
  IGetUserActivitySummaryV1Return,
  IGetUserActivityUsersV1Params,
  IGetUserActivityUsersV1Return
} from './index.d';

class UserActivityService extends ServiceBase {
  public GetUserActivitySummaryV1(
    params: IGetUserActivitySummaryV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserActivitySummaryV1Return>(
      '/v1/dms/statistic/user_activity/summary',
      paramsData,
      options
    );
  }

  public GetUserActivityDailyTrendV1(
    params: IGetUserActivityDailyTrendV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserActivityDailyTrendV1Return>(
      '/v1/dms/statistic/user_activity/daily_trend',
      paramsData,
      options
    );
  }

  public GetUserActivityModuleDistributionV1(
    params: IGetUserActivityModuleDistributionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserActivityModuleDistributionV1Return>(
      '/v1/dms/statistic/user_activity/module_distribution',
      paramsData,
      options
    );
  }

  public GetUserActivityHourlyDistributionV1(
    params: IGetUserActivityHourlyDistributionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserActivityHourlyDistributionV1Return>(
      '/v1/dms/statistic/user_activity/hourly_distribution',
      paramsData,
      options
    );
  }

  public GetUserActivityUsersV1(
    params: IGetUserActivityUsersV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserActivityUsersV1Return>(
      '/v1/dms/statistic/user_activity/users',
      paramsData,
      options
    );
  }
}

export default new UserActivityService();
