/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IV1AddServerParams,
  IV1AddServerReturn,
  IV1DeleteServerParams,
  IV1DeleteServerReturn,
  IV1GetServerHostnameParams,
  IV1GetServerHostnameReturn,
  IV1ListServersParams,
  IV1ListServersReturn,
  IV1UpdateServerParams,
  IV1UpdateServerReturn
} from './index.d';

class ServerService extends ServiceBase {
  public V1AddServer(params: IV1AddServerParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1AddServerReturn>('/v1/server/add', paramsData, options);
  }

  public V1DeleteServer(
    params: IV1DeleteServerParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1DeleteServerReturn>(
      '/v1/server/delete',
      paramsData,
      options
    );
  }

  public V1GetServerHostname(
    params: IV1GetServerHostnameParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IV1GetServerHostnameReturn>(
      '/v1/server/hostname',
      paramsData,
      options
    );
  }

  public V1ListServers(
    params: IV1ListServersParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IV1ListServersReturn>(
      '/v1/server/list',
      paramsData,
      options
    );
  }

  public V1UpdateServer(
    params: IV1UpdateServerParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1UpdateServerReturn>(
      '/v1/server/update',
      paramsData,
      options
    );
  }
}

const serverService = new ServerService();

export default serverService;
