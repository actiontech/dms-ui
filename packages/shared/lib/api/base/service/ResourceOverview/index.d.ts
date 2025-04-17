import {
  IResourceOverviewResourceListResV1,
  IResourceOverviewResourceTypeDistributionResV1,
  IResourceOverviewStatisticsResV1,
  IResourceOverviewTopologyResV1
} from '../common.d';

export interface IGetResourceOverviewResourceListV1Params {
  filter_by_db_type?: string;

  filter_by_business_tag_uid?: string;

  filter_by_environment_tag_uid?: string;

  filter_by_project_uid?: string;

  fuzzy_search_resource_name?: string;

  sort_by_field?: string;

  sort_asc?: boolean;

  page_index?: number;

  page_size?: number;
}

export interface IGetResourceOverviewResourceListV1Return
  extends IResourceOverviewResourceListResV1 {}

export interface IGetResourceOverviewResourceTypeDistributionV1Return
  extends IResourceOverviewResourceTypeDistributionResV1 {}

export interface IGetResourceOverviewStatisticsV1Return
  extends IResourceOverviewStatisticsResV1 {}

export interface IGetResourceOverviewTopologyV1Params {
  filter_by_db_type?: string;

  filter_by_business_tag_uid?: string;

  filter_by_environment_tag_uid?: string;

  filter_by_project_uid?: string;

  fuzzy_search_resource_name?: string;
}

export interface IGetResourceOverviewTopologyV1Return
  extends IResourceOverviewTopologyResV1 {}
