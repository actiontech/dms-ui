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
  IV1ListMonitorDBsReturn
} from './index.d';

class DbService extends ServiceBase {
  public V1AddDB(params: IV1AddDBParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IV1AddDBReturn>(
      `/diagno/v1/${project_uid}/db/add`,
      paramsData,
      options
    );
  }

  public V1DeleteDB(params: IV1DeleteDBParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IV1DeleteDBReturn>(
      `/diagno/v1/${project_uid}/db/delete`,
      paramsData,
      options
    );
  }

  public V1ListMonitorDBs(
    params: IV1ListMonitorDBsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IV1ListMonitorDBsReturn>(
      `/diagno/v1/${project_uid}/db/list`,
      paramsData,
      options
    );
  }
}

export default new DbService();
