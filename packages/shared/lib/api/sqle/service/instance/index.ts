/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetDatabaseDriverLogosParams,
  IGetDatabaseDriverLogosReturn,
  IGetDatabaseDriverOptionsReturn,
  IGetInstanceTipListV1Params,
  IGetInstanceTipListV1Return,
  IBatchCheckInstanceIsConnectableByNameParams,
  IBatchCheckInstanceIsConnectableByNameReturn,
  ICheckInstanceIsConnectableByNameV1Params,
  ICheckInstanceIsConnectableByNameV1Return,
  IGetInstanceRuleListV1Params,
  IGetInstanceRuleListV1Return,
  IGetInstanceSchemasV1Params,
  IGetInstanceSchemasV1Return,
  IListTableBySchemaParams,
  IListTableBySchemaReturn,
  IGetTableMetadataParams,
  IGetTableMetadataReturn,
  IGetInstanceTipListV2Params,
  IGetInstanceTipListV2Return,
  IGetInstanceV2Params,
  IGetInstanceV2Return
} from './index.d';

class InstanceService extends ServiceBase {
  public GetDatabaseDriverLogos(
    params: IGetDatabaseDriverLogosParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetDatabaseDriverLogosReturn>(
      '/v1/database_driver_logos',
      paramsData,
      options
    );
  }

  public getDatabaseDriverOptions(options?: AxiosRequestConfig) {
    return this.get<IGetDatabaseDriverOptionsReturn>(
      '/v1/database_driver_options',
      undefined,
      options
    );
  }

  public getInstanceTipListV1(
    params: IGetInstanceTipListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetInstanceTipListV1Return>(
      `/v1/projects/${project_name}/instance_tips`,
      paramsData,
      options
    );
  }

  public batchCheckInstanceIsConnectableByName(
    params: IBatchCheckInstanceIsConnectableByNameParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IBatchCheckInstanceIsConnectableByNameReturn>(
      `/v1/projects/${project_name}/instances/connections`,
      paramsData,
      options
    );
  }

  public checkInstanceIsConnectableByNameV1(
    params: ICheckInstanceIsConnectableByNameV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<ICheckInstanceIsConnectableByNameV1Return>(
      `/v1/projects/${project_name}/instances/${instance_name}/connection`,
      paramsData,
      options
    );
  }

  public getInstanceRuleListV1(
    params: IGetInstanceRuleListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceRuleListV1Return>(
      `/v1/projects/${project_name}/instances/${instance_name}/rules`,
      paramsData,
      options
    );
  }

  public getInstanceSchemasV1(
    params: IGetInstanceSchemasV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceSchemasV1Return>(
      `/v1/projects/${project_name}/instances/${instance_name}/schemas`,
      paramsData,
      options
    );
  }

  public listTableBySchema(
    params: IListTableBySchemaParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    const schema_name = paramsData.schema_name;
    delete paramsData.schema_name;

    return this.get<IListTableBySchemaReturn>(
      `/v1/projects/${project_name}/instances/${instance_name}/schemas/${schema_name}/tables`,
      paramsData,
      options
    );
  }

  public getTableMetadata(
    params: IGetTableMetadataParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    const schema_name = paramsData.schema_name;
    delete paramsData.schema_name;

    const table_name = paramsData.table_name;
    delete paramsData.table_name;

    return this.get<IGetTableMetadataReturn>(
      `/v1/projects/${project_name}/instances/${instance_name}/schemas/${schema_name}/tables/${table_name}/metadata`,
      paramsData,
      options
    );
  }

  public getInstanceTipListV2(
    params: IGetInstanceTipListV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetInstanceTipListV2Return>(
      `/v2/projects/${project_name}/instance_tips`,
      paramsData,
      options
    );
  }

  public getInstanceV2(
    params: IGetInstanceV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceV2Return>(
      `/v2/projects/${project_name}/instances/${instance_name}/`,
      paramsData,
      options
    );
  }
}

export default new InstanceService();
