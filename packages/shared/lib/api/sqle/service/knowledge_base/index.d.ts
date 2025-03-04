import {
  IGetKnowledgeBaseListRes,
  IGetKnowledgeGraphResp,
  IGetKnowledgeBaseTagListRes
} from '../common.d';

export interface IGetKnowledgeBaseListParams {
  keywords?: string;

  tags?: string[];

  page_index: number;

  page_size: number;
}

export interface IGetKnowledgeBaseListReturn extends IGetKnowledgeBaseListRes {}

export interface IGetKnowledgeGraphParams {
  filter_by_rule_name?: string;
}

export interface IGetKnowledgeGraphReturn extends IGetKnowledgeGraphResp {}

export interface IGetKnowledgeBaseTagListReturn
  extends IGetKnowledgeBaseTagListRes {}
