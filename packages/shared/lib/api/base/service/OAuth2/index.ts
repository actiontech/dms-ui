/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetOauth2TipsReturn,
  IBindOauth2UserParams,
  IBindOauth2UserReturn
} from './index.d';

class OAuth2Service extends ServiceBase {
  public Oauth2LinkOrCallback(options?: AxiosRequestConfig) {
    return this.get('/v1/dms/oauth2/link', undefined, options);
  }

  public GetOauth2Tips(options?: AxiosRequestConfig) {
    return this.get<IGetOauth2TipsReturn>(
      '/v1/dms/oauth2/tips',
      undefined,
      options
    );
  }

  public BindOauth2User(
    params: IBindOauth2UserParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IBindOauth2UserReturn>(
      '/v1/dms/oauth2/user/bind',
      paramsData,
      options
    );
  }
}

export default new OAuth2Service();
