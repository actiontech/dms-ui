/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IListMaskingRulesReturn } from './index.d';

class MaskingService extends ServiceBase {
  public ListMaskingRules(options?: AxiosRequestConfig) {
    return this.get<IListMaskingRulesReturn>(
      '/v1/dms/masking/rules',
      undefined,
      options
    );
  }
}

export default new MaskingService();
