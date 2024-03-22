import {
  GetSqlDEVRecordListFilterSourceEnum,
  GetSqlDEVRecordListSortFieldEnum,
  GetSqlDEVRecordListSortOrderEnum
} from './index.enum';

import { IGetSqlDEVRecordListResp } from '../common.d';

export interface IGetSqlDEVRecordListParams {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_instance_name?: string;

  filter_source?: GetSqlDEVRecordListFilterSourceEnum;

  filter_creator?: string;

  filter_last_receive_time_from?: string;

  filter_last_receive_time_to?: string;

  sort_field?: GetSqlDEVRecordListSortFieldEnum;

  sort_order?: GetSqlDEVRecordListSortOrderEnum;

  page_index: number;

  page_size: number;
}

export interface IGetSqlDEVRecordListReturn extends IGetSqlDEVRecordListResp {}
