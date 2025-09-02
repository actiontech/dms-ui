/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IAuthListPasswordSecurityPolicysParams,
  IAuthListPasswordSecurityPolicysReturn,
  IAuthAddPasswordSecurityPolicyParams,
  IAuthAddPasswordSecurityPolicyReturn,
  IAuthUpdatePasswordSecurityPolicyParams,
  IAuthUpdatePasswordSecurityPolicyReturn,
  IAuthDelPasswordSecurityPolicyParams,
  IAuthDelPasswordSecurityPolicyReturn
} from './index.d';

class PasswordSecuryPolicyService extends ServiceBase {
  public AuthListPasswordSecurityPolicys(
    params: IAuthListPasswordSecurityPolicysParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IAuthListPasswordSecurityPolicysReturn>(
      `/v1/auth/projects/${project_uid}/password_security_policys`,
      paramsData,
      options
    );
  }

  public AuthAddPasswordSecurityPolicy(
    params: IAuthAddPasswordSecurityPolicyParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAuthAddPasswordSecurityPolicyReturn>(
      `/v1/auth/projects/${project_uid}/password_security_policys`,
      paramsData,
      options
    );
  }

  public AuthUpdatePasswordSecurityPolicy(
    params: IAuthUpdatePasswordSecurityPolicyParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const uid = paramsData.uid;
    delete paramsData.uid;

    return this.put<IAuthUpdatePasswordSecurityPolicyReturn>(
      `/v1/auth/projects/${project_uid}/password_security_policys/${uid}`,
      paramsData,
      options
    );
  }

  public AuthDelPasswordSecurityPolicy(
    params: IAuthDelPasswordSecurityPolicyParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const uid = paramsData.uid;
    delete paramsData.uid;

    return this.delete<IAuthDelPasswordSecurityPolicyReturn>(
      `/v1/auth/projects/${project_uid}/password_security_policys/${uid}`,
      paramsData,
      options
    );
  }
}

export default new PasswordSecuryPolicyService();
