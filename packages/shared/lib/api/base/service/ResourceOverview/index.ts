/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetResourceOverviewResourceListV1Params,
  IGetResourceOverviewResourceListV1Return,
  IGetResourceOverviewResourceTypeDistributionV1Return,
  IGetResourceOverviewStatisticsV1Return,
  IGetResourceOverviewTopologyV1Params,
  IGetResourceOverviewTopologyV1Return
} from './index.d';

class ResourceOverviewService extends ServiceBase {
  public GetResourceOverviewResourceListV1(
    params: IGetResourceOverviewResourceListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetResourceOverviewResourceListV1Return>(
      '/v1/dms/resource_overview/resource_list',
      paramsData,
      options
    );
  }

  public GetResourceOverviewResourceTypeDistributionV1(
    options?: AxiosRequestConfig
  ) {
    return this.get<IGetResourceOverviewResourceTypeDistributionV1Return>(
      '/v1/dms/resource_overview/resource_type_distribution',
      undefined,
      options
    );
  }

  public GetResourceOverviewStatisticsV1(options?: AxiosRequestConfig) {
    return this.get<IGetResourceOverviewStatisticsV1Return>(
      '/v1/dms/resource_overview/statistics',
      undefined,
      options
    );
  }

  public GetResourceOverviewTopologyV1(
    params: IGetResourceOverviewTopologyV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetResourceOverviewTopologyV1Return>(
      '/v1/dms/resource_overview/topology',
      paramsData,
      options
    );
  }
}

export default new ResourceOverviewService();
