/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IAuthGetDBAccountMetaParams,
  IAuthGetDBAccountMetaReturn,
  IGetDatabaseDriverOptionsReturn
} from './index.d';

class ServiceService extends ServiceBase {
  public AuthGetDBAccountMeta(
    params: IAuthGetDBAccountMetaParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const service_uid = paramsData.service_uid;
    delete paramsData.service_uid;

    return this.get<IAuthGetDBAccountMetaReturn>(
      `/v1/auth/projects/${project_uid}/services/${service_uid}/`,
      paramsData,
      options
    );
  }

  public GetDatabaseDriverOptions(options?: AxiosRequestConfig) {
    return this.get<IGetDatabaseDriverOptionsReturn>(
      '/v1/plugin/database_driver_options',
      undefined,
      options
    );
  }
}

export default new ServiceService();
