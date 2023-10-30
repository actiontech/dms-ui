import {
  ISaveServersReq,
  IGenericResp,
  IDeleteServersReq,
  IListServersReply
} from '../common.d';

export interface IV1AddServerParams extends ISaveServersReq {}

export interface IV1AddServerReturn extends IGenericResp {}

export interface IV1DeleteServerParams extends IDeleteServersReq {}

export interface IV1DeleteServerReturn extends IGenericResp {}

export interface IV1ListServersParams {
  fuzzy_search_keyword?: string;

  page_index?: number;

  page_size?: number;

  project_uid: string;

  server_name?: string;
}

export interface IV1ListServersReturn extends IListServersReply {}
