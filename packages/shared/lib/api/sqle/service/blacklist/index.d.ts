import { getBlacklistV1FilterTypeEnum } from './index.enum';

import {
  IGetBlacklistResV1,
  ICreateBlacklistReqV1,
  IBaseRes,
  IUpdateBlacklistReqV1
} from '../common.d';

export interface IGetBlacklistV1Params {
  project_name: string;

  filter_type?: getBlacklistV1FilterTypeEnum;

  fuzzy_search_content?: string;

  page_index: string;

  page_size: string;
}

export interface IGetBlacklistV1Return extends IGetBlacklistResV1 {}

export interface ICreateBlacklistV1Params extends ICreateBlacklistReqV1 {
  project_name: string;
}

export interface ICreateBlacklistV1Return extends IBaseRes {}

export interface IDeleteBlackListParams {
  project_name: string;

  blacklist_id: string;
}

export interface IDeleteBlackListReturn extends IBaseRes {}

export interface IUpdateBlacklistV1Params extends IUpdateBlacklistReqV1 {
  project_name: string;

  blacklist_id: string;
}

export interface IUpdateBlacklistV1Return extends IBaseRes {}
