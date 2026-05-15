/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetAIHubBannerReturn,
  IGetAIHubExecutionDataReturn,
  IGetAIHubManagementViewReturn,
  IGetAIHubStrategicValueReturn
} from './index.d';

class AiHubService extends ServiceBase {
  public GetAIHubBanner(options?: AxiosRequestConfig) {
    return this.get<IGetAIHubBannerReturn>(
      '/v1/ai_hub/banner',
      undefined,
      options
    );
  }

  public GetAIHubExecutionData(options?: AxiosRequestConfig) {
    return this.get<IGetAIHubExecutionDataReturn>(
      '/v1/ai_hub/execution_data',
      undefined,
      options
    );
  }

  public GetAIHubManagementView(options?: AxiosRequestConfig) {
    return this.get<IGetAIHubManagementViewReturn>(
      '/v1/ai_hub/management_view',
      undefined,
      options
    );
  }

  public GetAIHubStrategicValue(options?: AxiosRequestConfig) {
    return this.get<IGetAIHubStrategicValueReturn>(
      '/v1/ai_hub/strategic_value',
      undefined,
      options
    );
  }
}

export default new AiHubService();
