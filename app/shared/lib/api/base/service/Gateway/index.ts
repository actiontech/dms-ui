/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListGatewaysParams,
  IListGatewaysReturn,
  IAddGatewayParams,
  IAddGatewayReturn,
  IGetGatewayTipsReturn,
  IGetGatewayParams,
  IGetGatewayReturn,
  IUpdateGatewayParams,
  IUpdateGatewayReturn,
  IDeleteGatewayParams,
  IDeleteGatewayReturn
} from './index.d';

class GatewayService extends ServiceBase {
  public ListGateways(
    params: IListGatewaysParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListGatewaysReturn>(
      '/v1/dms/gateways',
      paramsData,
      options
    );
  }

  public AddGateway(params: IAddGatewayParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddGatewayReturn>(
      '/v1/dms/gateways',
      paramsData,
      options
    );
  }

  public GetGatewayTips(options?: AxiosRequestConfig) {
    return this.get<IGetGatewayTipsReturn>(
      '/v1/dms/gateways/tips',
      undefined,
      options
    );
  }

  public GetGateway(params: IGetGatewayParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const gateway_id = paramsData.gateway_id;
    delete paramsData.gateway_id;

    return this.get<IGetGatewayReturn>(
      `/v1/dms/gateways/${gateway_id}`,
      paramsData,
      options
    );
  }

  public UpdateGateway(
    params: IUpdateGatewayParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const gateway_id = paramsData.gateway_id;
    delete paramsData.gateway_id;

    return this.put<IUpdateGatewayReturn>(
      `/v1/dms/gateways/${gateway_id}`,
      paramsData,
      options
    );
  }

  public DeleteGateway(
    params: IDeleteGatewayParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const gateway_id = paramsData.gateway_id;
    delete paramsData.gateway_id;

    return this.delete<IDeleteGatewayReturn>(
      `/v1/dms/gateways/${gateway_id}`,
      paramsData,
      options
    );
  }
}

export default new GatewayService();
