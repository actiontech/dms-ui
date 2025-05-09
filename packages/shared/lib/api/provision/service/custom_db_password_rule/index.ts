/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IAuthGetCustomDBPasswordRuleReturn,
  IAuthUpdateCustomDBPasswordRuleParams,
  IAuthUpdateCustomDBPasswordRuleReturn
} from './index.d';

class CustomDbPasswordRuleService extends ServiceBase {
  public AuthGetCustomDBPasswordRule(options?: AxiosRequestConfig) {
    return this.get<IAuthGetCustomDBPasswordRuleReturn>(
      '/v1/auth/custom_db_password_rule',
      undefined,
      options
    );
  }

  public AuthUpdateCustomDBPasswordRule(
    params: IAuthUpdateCustomDBPasswordRuleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.put<IAuthUpdateCustomDBPasswordRuleReturn>(
      '/v1/auth/custom_db_password_rule',
      paramsData,
      options
    );
  }
}

export default new CustomDbPasswordRuleService();
