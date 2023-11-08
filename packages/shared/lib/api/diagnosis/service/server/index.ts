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
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IV1AddServerReturn>(
      `/diagno/v1/projects/${project_uid}/server/add`,
      paramsData,
      options
    );
  }

  public V1DeleteServer(
    params: IV1DeleteServerParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IV1DeleteServerReturn>(
      `/diagno/v1/projects/${project_uid}/server/delete`,
      paramsData,
      options
    );
  }

  public V1GetServerHostname(
    params: IV1GetServerHostnameParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IV1GetServerHostnameReturn>(
      `/diagno/v1/projects/${project_uid}/server/hostname`,
      paramsData,
      options
    );
  }

  public V1ListServers(
    params: IV1ListServersParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IV1ListServersReturn>(
      `/diagno/v1/projects/${project_uid}/server/list`,
      paramsData,
      options
    );
  }

  public V1UpdateServer(
    params: IV1UpdateServerParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IV1UpdateServerReturn>(
      `/diagno/v1/projects/${project_uid}/server/update`,
      paramsData,
      options
    );
  }
}

export default new ServerService();
