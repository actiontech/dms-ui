/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IGetKnowledgeGraphReturn } from './index.d';

class KnowledgeService extends ServiceBase {
  public getKnowledgeGraph(options?: AxiosRequestConfig) {
    return this.get<IGetKnowledgeGraphReturn>(
      '/v1/knowledge_bases/graph',
      undefined,
      options
    );
  }
}

export default new KnowledgeService();
