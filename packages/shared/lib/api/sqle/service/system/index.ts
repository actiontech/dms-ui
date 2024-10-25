/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSystemModuleRedDotsReturn,
  IGetSystemModuleStatusParams,
  IGetSystemModuleStatusReturn
} from './index.d';

class SystemService extends ServiceBase {
  public GetSystemModuleRedDots(options?: AxiosRequestConfig) {
    return this.get<IGetSystemModuleRedDotsReturn>(
      '/v1/system/module_red_dots',
      undefined,
      options
    );
  }

  public getSystemModuleStatus(
    params: IGetSystemModuleStatusParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetSystemModuleStatusReturn>(
      '/v1/system/module_status',
      paramsData,
      options
    );
  }
}

export default new SystemService();
