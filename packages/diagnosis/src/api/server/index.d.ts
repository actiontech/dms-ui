import {
  IViewAddServerRequest,
  IGenericResp,
  IDeleteServersReq,
  IGetServerHostnameReply,
  IListServersReply,
  IViewUpdateServerRequest
} from '../common.d';

export interface IV1AddServerParams extends IViewAddServerRequest {}

export interface IV1AddServerReturn extends IGenericResp {}

export interface IV1DeleteServerParams extends IDeleteServersReq {}

export interface IV1DeleteServerReturn extends IGenericResp {}

export interface IV1GetServerHostnameParams {
  host: string;

  password: string;

  port?: number;

  user: string;
}

export interface IV1GetServerHostnameReturn extends IGetServerHostnameReply {}

export interface IV1ListServersParams {
  fuzzy_search_keyword?: string;

  page_index?: number;

  page_size?: number;

  server_name?: string;
}

export interface IV1ListServersReturn extends IListServersReply {}

export interface IV1UpdateServerParams extends IViewUpdateServerRequest {}

export interface IV1UpdateServerReturn extends IGenericResp {}
