import {
  GetSqlDEVRecordListFilterSourceEnum,
  GetSqlDEVRecordListSortFieldEnum,
  GetSqlDEVRecordListSortOrderEnum,
  exportSqlDevRecordsV1FilterSourceEnum,
  exportSqlDevRecordsV1SortFieldEnum,
  exportSqlDevRecordsV1SortOrderEnum
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

  filter_db_type?: string;

  sort_field?: GetSqlDEVRecordListSortFieldEnum;

  sort_order?: GetSqlDEVRecordListSortOrderEnum;

  page_index: number;

  page_size: number;
}

export interface IGetSqlDEVRecordListReturn extends IGetSqlDEVRecordListResp {}

export interface IExportSqlDevRecordsV1Params {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_instance_name?: string;

  filter_source?: exportSqlDevRecordsV1FilterSourceEnum;

  filter_creator?: string;

  filter_last_receive_time_from?: string;

  filter_last_receive_time_to?: string;

  filter_db_type?: string;

  fuzzy_search_schema_name?: string;

  filter_sql_dev_record_ids?: string;

  sort_field?: exportSqlDevRecordsV1SortFieldEnum;

  sort_order?: exportSqlDevRecordsV1SortOrderEnum;
}
