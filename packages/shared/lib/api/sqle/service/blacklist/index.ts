/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetBlacklistV1Params,
  IGetBlacklistV1Return,
  ICreateBlacklistV1Params,
  ICreateBlacklistV1Return,
  IDeleteBlackListParams,
  IDeleteBlackListReturn,
  IUpdateBlacklistV1Params,
  IUpdateBlacklistV1Return
} from './index.d';

class BlacklistService extends ServiceBase {
  public getBlacklistV1(
    params: IGetBlacklistV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetBlacklistV1Return>(
      `/v1/projects/${project_name}/blacklist`,
      paramsData,
      options
    );
  }

  public createBlacklistV1(
    params: ICreateBlacklistV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateBlacklistV1Return>(
      `/v1/projects/${project_name}/blacklist`,
      paramsData,
      options
    );
  }

  public deleteBlackList(
    params: IDeleteBlackListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const blacklist_id = paramsData.blacklist_id;
    delete paramsData.blacklist_id;

    return this.delete<IDeleteBlackListReturn>(
      `/v1/projects/${project_name}/blacklist/${blacklist_id}/`,
      paramsData,
      options
    );
  }

  public updateBlacklistV1(
    params: IUpdateBlacklistV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const blacklist_id = paramsData.blacklist_id;
    delete paramsData.blacklist_id;

    return this.patch<IUpdateBlacklistV1Return>(
      `/v1/projects/${project_name}/blacklist/${blacklist_id}/`,
      paramsData,
      options
    );
  }
}

export default new BlacklistService();
