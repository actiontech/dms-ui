/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IGetUserTipListV1Params, IGetUserTipListV1Return } from './index.d';

class UserService extends ServiceBase {
  public getUserTipListV1(
    params: IGetUserTipListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserTipListV1Return>(
      '/v1/user_tips',
      paramsData,
      options
    );
  }
}

export default new UserService();
