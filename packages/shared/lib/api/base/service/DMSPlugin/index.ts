/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IRegisterDMSPluginParams, IRegisterDMSPluginReturn } from './index.d';

class DMSPluginService extends ServiceBase {
  public RegisterDMSPlugin(
    params: IRegisterDMSPluginParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IRegisterDMSPluginReturn>(
      '/v1/dms/plugins',
      paramsData,
      options
    );
  }
}

export default new DMSPluginService();
