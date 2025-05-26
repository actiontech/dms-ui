/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IV1AddDBParams,
  IV1AddDBReturn,
  IV1DeleteDBParams,
  IV1DeleteDBReturn,
  IV1ListMonitorDBsParams,
  IV1ListMonitorDBsReturn,
  IV1UpdateDBParams,
  IV1UpdateDBReturn
} from './index.d';

class DbService extends ServiceBase {
  public V1AddDB(params: IV1AddDBParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1AddDBReturn>('/v1/db/add', paramsData, options);
  }

  public V1DeleteDB(params: IV1DeleteDBParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1DeleteDBReturn>('/v1/db/delete', paramsData, options);
  }

  public V1ListMonitorDBs(
    params: IV1ListMonitorDBsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IV1ListMonitorDBsReturn>(
      '/v1/db/list',
      paramsData,
      options
    );
  }

  public V1UpdateDB(params: IV1UpdateDBParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1UpdateDBReturn>('/v1/db/update', paramsData, options);
  }
}

const dbService = new DbService();

export default dbService;
