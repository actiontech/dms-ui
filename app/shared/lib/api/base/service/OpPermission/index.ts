/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IListOpPermissionsParams, IListOpPermissionsReturn } from './index.d';

class OpPermissionService extends ServiceBase {
  public ListOpPermissions(
    params: IListOpPermissionsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListOpPermissionsReturn>(
      '/v1/dms/op_permissions',
      paramsData,
      options
    );
  }
}

export default new OpPermissionService();
