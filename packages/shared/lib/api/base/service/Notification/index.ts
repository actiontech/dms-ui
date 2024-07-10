/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { INotificationParams, INotificationReturn } from './index.d';

class NotificationService extends ServiceBase {
  public Notification(
    params: INotificationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<INotificationReturn>(
      '/v1/dms/notifications',
      paramsData,
      options
    );
  }
}

export default new NotificationService();
