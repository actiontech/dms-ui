/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IGetSQLQueryConfigurationReturn } from './index.d';

class CloudBeaverService extends ServiceBase {
  public GetSQLQueryConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetSQLQueryConfigurationReturn>(
      '/v1/dms/configurations/sql_query',
      undefined,
      options
    );
  }
}

export default new CloudBeaverService();
