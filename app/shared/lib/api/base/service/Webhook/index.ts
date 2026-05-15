/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IWebHookSendMessageParams,
  IWebHookSendMessageReturn
} from './index.d';

class WebhookService extends ServiceBase {
  public WebHookSendMessage(
    params: IWebHookSendMessageParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IWebHookSendMessageReturn>(
      '/v1/dms/webhooks',
      paramsData,
      options
    );
  }
}

export default new WebhookService();
