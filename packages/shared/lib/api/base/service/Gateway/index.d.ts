import {
  IListGatewaysReply,
  IAddGatewayReq,
  IGenericResp,
  IGetGatewayTipsReply,
  IGetGatewayReply,
  IUpdateGatewayReq
} from '../common.d';

export interface IListGatewaysParams {
  page_index?: number;

  page_size: number;
}

export interface IListGatewaysReturn extends IListGatewaysReply {}

export interface IAddGatewayParams extends IAddGatewayReq {}

export interface IAddGatewayReturn extends IGenericResp {}

export interface IGetGatewayTipsReturn extends IGetGatewayTipsReply {}

export interface IGetGatewayParams {
  gateway_id: string;
}

export interface IGetGatewayReturn extends IGetGatewayReply {}

export interface IUpdateGatewayParams extends IUpdateGatewayReq {
  gateway_id: string;
}

export interface IUpdateGatewayReturn extends IGenericResp {}

export interface IDeleteGatewayParams {
  gateway_id: string;
}

export interface IDeleteGatewayReturn extends IGenericResp {}
