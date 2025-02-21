/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  ISendSmsCodeParams,
  ISendSmsCodeReturn,
  IVerifySmsCodeParams,
  IVerifySmsCodeReturn
} from './index.d';

class SMSService extends ServiceBase {
  public SendSmsCode(params: ISendSmsCodeParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<ISendSmsCodeReturn>(
      '/v1/dms/configurations/sms/send_code',
      paramsData,
      options
    );
  }

  public VerifySmsCode(
    params: IVerifySmsCodeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IVerifySmsCodeReturn>(
      '/v1/dms/configurations/sms/verify_code',
      paramsData,
      options
    );
  }
}

export default new SMSService();
