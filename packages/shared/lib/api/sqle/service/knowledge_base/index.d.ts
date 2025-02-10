import {
  IGetKnowledgeBaseListRes,
  IGetKnowledgeBaseTagListRes
} from '../common.d';

export interface IGetKnowledgeBaseListParams {
  keywords?: string;

  tags?: string[];
}

export interface IGetKnowledgeBaseListReturn extends IGetKnowledgeBaseListRes {}

export interface IGetKnowledgeBaseTagListReturn
  extends IGetKnowledgeBaseTagListRes {}
