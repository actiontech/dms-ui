/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetBasicInfoReturn,
  IPersonalizationParams,
  IPersonalizationReturn
} from './index.d';

class BasicInfoService extends ServiceBase {
  public GetBasicInfo(options?: AxiosRequestConfig) {
    return this.get<IGetBasicInfoReturn>(
      '/v1/dms/basic_info',
      undefined,
      options
    );
  }

  public Personalization(
    params: IPersonalizationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IPersonalizationReturn>(
      '/v1/dms/personalization',
      paramsData,
      options
    );
  }

  public GetStaticLogo(options?: AxiosRequestConfig) {
    return this.get('/v1/dms/personalization/logo', undefined, options);
  }
}

export default new BasicInfoService();
