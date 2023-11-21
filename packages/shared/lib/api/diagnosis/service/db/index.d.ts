import {
  ISaveDBsReq,
  IGenericResp,
  IDeleteDBsReq,
  IListDBsReply
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
