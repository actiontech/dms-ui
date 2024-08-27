/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetPipelinesV1Params,
  IGetPipelinesV1Return,
  ICreatePipelineV1Params,
  ICreatePipelineV1Return,
  IGetPipelineDetailV1Params,
  IGetPipelineDetailV1Return,
  IDeletePipelineV1Params,
  IDeletePipelineV1Return,
  IUpdatePipelineV1Params,
  IUpdatePipelineV1Return
} from './index.d';

class PipelineService extends ServiceBase {
  public getPipelinesV1(
    params: IGetPipelinesV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetPipelinesV1Return>(
      `/v1/projects/${project_name}/pipelines`,
      paramsData,
      options
    );
  }

  public createPipelineV1(
    params: ICreatePipelineV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreatePipelineV1Return>(
      `/v1/projects/${project_name}/pipelines`,
      paramsData,
      options
    );
  }

  public getPipelineDetailV1(
    params: IGetPipelineDetailV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const pipeline_id = paramsData.pipeline_id;
    delete paramsData.pipeline_id;

    return this.get<IGetPipelineDetailV1Return>(
      `/v1/projects/${project_name}/pipelines/${pipeline_id}/`,
      paramsData,
      options
    );
  }

  public deletePipelineV1(
    params: IDeletePipelineV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const pipeline_id = paramsData.pipeline_id;
    delete paramsData.pipeline_id;

    return this.delete<IDeletePipelineV1Return>(
      `/v1/projects/${project_name}/pipelines/${pipeline_id}/`,
      paramsData,
      options
    );
  }

  public updatePipelineV1(
    params: IUpdatePipelineV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const pipeline_id = paramsData.pipeline_id;
    delete paramsData.pipeline_id;

    return this.patch<IUpdatePipelineV1Return>(
      `/v1/projects/${project_name}/pipelines/${pipeline_id}/`,
      paramsData,
      options
    );
  }
}

export default new PipelineService();
