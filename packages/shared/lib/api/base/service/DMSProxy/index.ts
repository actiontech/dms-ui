/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IRegisterDMSProxyTargetParams,
  IRegisterDMSProxyTargetReturn
} from './index.d';

class DMSProxyService extends ServiceBase {
  public RegisterDMSProxyTarget(
    params: IRegisterDMSProxyTargetParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IRegisterDMSProxyTargetReturn>(
      '/v1/dms/proxys',
      paramsData,
      options
    );
  }
}

export default new DMSProxyService();
