/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetKnowledgeBaseListParams,
  IGetKnowledgeBaseListReturn,
  IGetKnowledgeBaseTagListReturn
} from './index.d';

class KnowledgeBaseService extends ServiceBase {
  public getKnowledgeBaseList(
    params: IGetKnowledgeBaseListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetKnowledgeBaseListReturn>(
      '/v1/knowledge_bases',
      paramsData,
      options
    );
  }

  public getKnowledgeBaseTagList(options?: AxiosRequestConfig) {
    return this.get<IGetKnowledgeBaseTagListReturn>(
      '/v1/knowledge_bases/tags',
      undefined,
      options
    );
  }
}

export default new KnowledgeBaseService();
