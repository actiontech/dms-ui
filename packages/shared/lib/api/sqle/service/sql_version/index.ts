/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSqlVersionListV1Params,
  IGetSqlVersionListV1Return,
  ICreateSqlVersionV1Params,
  ICreateSqlVersionV1Return,
  IGetSqlVersionDetailV1Params,
  IGetSqlVersionDetailV1Return,
  IDeleteSqlVersionV1Params,
  IDeleteSqlVersionV1Return,
  IUpdateSqlVersionV1Params,
  IUpdateSqlVersionV1Return,
  IBatchAssociateWorkflowsWithVersionV1Params,
  IBatchAssociateWorkflowsWithVersionV1Return,
  IBatchExecuteTasksOnWorkflowV1Params,
  IBatchExecuteTasksOnWorkflowV1Return,
  IBatchReleaseWorkflowsV1Params,
  IBatchReleaseWorkflowsV1Return,
  ILockSqlVersionV1Params,
  ILockSqlVersionV1Return,
  IRetryExecWorkflowV1Params,
  IRetryExecWorkflowV1Return,
  IGetWorkflowsThatCanBeAssociatedToVersionV1Params,
  IGetWorkflowsThatCanBeAssociatedToVersionV1Return,
  IGetDependenciesBetweenStageInstanceV1Params,
  IGetDependenciesBetweenStageInstanceV1Return
} from './index.d';

class SqlVersionService extends ServiceBase {
  public getSqlVersionListV1(
    params: IGetSqlVersionListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSqlVersionListV1Return>(
      `/v1/projects/${project_name}/sql_versions`,
      paramsData,
      options
    );
  }

  public createSqlVersionV1(
    params: ICreateSqlVersionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateSqlVersionV1Return>(
      `/v1/projects/${project_name}/sql_versions`,
      paramsData,
      options
    );
  }

  public getSqlVersionDetailV1(
    params: IGetSqlVersionDetailV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    return this.get<IGetSqlVersionDetailV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/`,
      paramsData,
      options
    );
  }

  public deleteSqlVersionV1(
    params: IDeleteSqlVersionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    return this.delete<IDeleteSqlVersionV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/`,
      paramsData,
      options
    );
  }

  public updateSqlVersionV1(
    params: IUpdateSqlVersionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    return this.patch<IUpdateSqlVersionV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/`,
      paramsData,
      options
    );
  }

  public batchAssociateWorkflowsWithVersionV1(
    params: IBatchAssociateWorkflowsWithVersionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    return this.post<IBatchAssociateWorkflowsWithVersionV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/associate_workflows`,
      paramsData,
      options
    );
  }

  public batchExecuteTasksOnWorkflowV1(
    params: IBatchExecuteTasksOnWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    return this.post<IBatchExecuteTasksOnWorkflowV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/batch_execute_workflows`,
      paramsData,
      options
    );
  }

  public batchReleaseWorkflowsV1(
    params: IBatchReleaseWorkflowsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    return this.post<IBatchReleaseWorkflowsV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/batch_release_workflows`,
      paramsData,
      options
    );
  }

  public lockSqlVersionV1(
    params: ILockSqlVersionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    return this.post<ILockSqlVersionV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/lock`,
      paramsData,
      options
    );
  }

  public retryExecWorkflowV1(
    params: IRetryExecWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    return this.post<IRetryExecWorkflowV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/retry_workflow`,
      paramsData,
      options
    );
  }

  public GetWorkflowsThatCanBeAssociatedToVersionV1(
    params: IGetWorkflowsThatCanBeAssociatedToVersionV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    const sql_version_stage_id = paramsData.sql_version_stage_id;
    delete paramsData.sql_version_stage_id;

    return this.get<IGetWorkflowsThatCanBeAssociatedToVersionV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/sql_version_stages/${sql_version_stage_id}/associate_workflows`,
      paramsData,
      options
    );
  }

  public getDependenciesBetweenStageInstanceV1(
    params: IGetDependenciesBetweenStageInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_version_id = paramsData.sql_version_id;
    delete paramsData.sql_version_id;

    const sql_version_stage_id = paramsData.sql_version_stage_id;
    delete paramsData.sql_version_stage_id;

    return this.get<IGetDependenciesBetweenStageInstanceV1Return>(
      `/v1/projects/${project_name}/sql_versions/${sql_version_id}/sql_version_stages/${sql_version_stage_id}/dependencies`,
      paramsData,
      options
    );
  }
}

export default new SqlVersionService();
