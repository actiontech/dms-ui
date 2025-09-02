/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IGetPlatformMetricsReturn } from './index.d';

class PlatformMetricsService extends ServiceBase {
  public GetPlatformMetrics(options?: AxiosRequestConfig) {
    return this.get<IGetPlatformMetricsReturn>(
      '/v1/dms/platform_metrics',
      undefined,
      options
    );
  }
}

export default new PlatformMetricsService();
