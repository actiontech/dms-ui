import {
  IGetPipelinesResV1,
  ICreatePipelineReqV1,
  ICreatePipelineResV1,
  IGetPipelineDetailResV1,
  IBaseRes,
  IUpdatePipelineReqV1
} from '../common.d';

export interface IGetPipelinesV1Params {
  project_name: string;

  fuzzy_search_name_desc?: string;

  page_index: number;

  page_size: number;
}

export interface IGetPipelinesV1Return extends IGetPipelinesResV1 {}

export interface ICreatePipelineV1Params extends ICreatePipelineReqV1 {
  project_name: string;
}

export interface ICreatePipelineV1Return extends ICreatePipelineResV1 {}

export interface IGetPipelineDetailV1Params {
  project_name: string;

  pipeline_id: string;
}

export interface IGetPipelineDetailV1Return extends IGetPipelineDetailResV1 {}

export interface IDeletePipelineV1Params {
  project_name: string;

  pipeline_id: string;
}

export interface IDeletePipelineV1Return extends IBaseRes {}

export interface IUpdatePipelineV1Params extends IUpdatePipelineReqV1 {
  project_name: string;

  pipeline_id: string;
}

export interface IUpdatePipelineV1Return extends IBaseRes {}

export interface IRefreshPipelineNodeTokenV1Params {
  project_name: string;

  pipeline_id: string;

  node_id: string;
}

export interface IRefreshPipelineNodeTokenV1Return extends IBaseRes {}
