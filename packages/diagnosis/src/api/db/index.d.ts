import {
  ISaveDBsReq,
  IGenericResp,
  IDeleteDBsReq,
  IListDBsReply,
  IViewUpdateDBRequest
} from '../common.d';

export interface IV1AddDBParams extends ISaveDBsReq {}

export interface IV1AddDBReturn extends IGenericResp {}

export interface IV1DeleteDBParams extends IDeleteDBsReq {}

export interface IV1DeleteDBReturn extends IGenericResp {}

export interface IV1ListMonitorDBsParams {
  db_monitor_name?: string;

  fuzzy_search_keyword?: string;

  page_index?: number;

  page_size?: number;
}

export interface IV1ListMonitorDBsReturn extends IListDBsReply {}

export interface IV1UpdateDBParams extends IViewUpdateDBRequest {}

export interface IV1UpdateDBReturn extends IGenericResp {}
