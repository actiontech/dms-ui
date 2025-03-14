/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IAddSessionParams,
  IAddSessionReturn,
  IDelSessionReturn,
  IRefreshSessionReturn,
  IGetUserBySessionParams,
  IGetUserBySessionReturn
} from './index.d';

class SessionService extends ServiceBase {
  public AddSession(params: IAddSessionParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddSessionReturn>(
      '/v1/dms/sessions',
      paramsData,
      options
    );
  }

  public DelSession(options?: AxiosRequestConfig) {
    return this.delete<IDelSessionReturn>(
      '/v1/dms/sessions',
      undefined,
      options
    );
  }

  public RefreshSession(options?: AxiosRequestConfig) {
    return this.post<IRefreshSessionReturn>(
      '/v1/dms/sessions/refresh',
      undefined,
      options
    );
  }

  public GetUserBySession(
    params: IGetUserBySessionParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserBySessionReturn>(
      '/v1/dms/sessions/user',
      paramsData,
      options
    );
  }
}

export default new SessionService();
