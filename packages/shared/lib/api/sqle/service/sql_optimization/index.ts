/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetOptimizationRecordsParams,
  IGetOptimizationRecordsReturn,
  IOptimizeSQLReqParams,
  IOptimizeSQLReqReturn,
  IGetOptimizationRecordReqParams,
  IGetOptimizationRecordReqReturn,
  IGetOptimizationSQLsParams,
  IGetOptimizationSQLsReturn,
  IGetOptimizationReqParams,
  IGetOptimizationReqReturn,
  IGetDBPerformanceImproveOverviewParams,
  IGetDBPerformanceImproveOverviewReturn,
  IGetOptimizationOverviewParams,
  IGetOptimizationOverviewReturn
} from './index.d';

class SqlOptimizationService extends ServiceBase {
  public getOptimizationRecords(
    params: IGetOptimizationRecordsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetOptimizationRecordsReturn>(
      `/v1/projects/${project_name}/sql_optimization_records`,
      paramsData,
      options
    );
  }

  public OptimizeSQLReq(
    params: IOptimizeSQLReqParams,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.instance_name != undefined) {
      paramsData.append('instance_name', params.instance_name as any);
    }

    if (params.schema_name != undefined) {
      paramsData.append('schema_name', params.schema_name as any);
    }

    if (params.db_type != undefined) {
      paramsData.append('db_type', params.db_type as any);
    }

    if (params.sql_content != undefined) {
      paramsData.append('sql_content', params.sql_content as any);
    }

    if (params.optimization_name != undefined) {
      paramsData.append('optimization_name', params.optimization_name as any);
    }

    if (params.input_sql_file != undefined) {
      paramsData.append('input_sql_file', params.input_sql_file as any);
    }

    if (params.input_mybatis_xml_file != undefined) {
      paramsData.append(
        'input_mybatis_xml_file',
        params.input_mybatis_xml_file as any
      );
    }

    if (params.input_zip_file != undefined) {
      paramsData.append('input_zip_file', params.input_zip_file as any);
    }

    if (params.git_http_url != undefined) {
      paramsData.append('git_http_url', params.git_http_url as any);
    }

    if (params.git_user_name != undefined) {
      paramsData.append('git_user_name', params.git_user_name as any);
    }

    if (params.git_user_password != undefined) {
      paramsData.append('git_user_password', params.git_user_password as any);
    }

    const project_name = params.project_name;

    return this.post<IOptimizeSQLReqReturn>(
      `/v1/projects/${project_name}/sql_optimization_records`,
      paramsData,
      config
    );
  }

  public GetOptimizationRecordReq(
    params: IGetOptimizationRecordReqParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const optimization_record_id = paramsData.optimization_record_id;
    delete paramsData.optimization_record_id;

    return this.get<IGetOptimizationRecordReqReturn>(
      `/v1/projects/${project_name}/sql_optimization_records/${optimization_record_id}/`,
      paramsData,
      options
    );
  }

  public getOptimizationSQLs(
    params: IGetOptimizationSQLsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const optimization_record_id = paramsData.optimization_record_id;
    delete paramsData.optimization_record_id;

    return this.get<IGetOptimizationSQLsReturn>(
      `/v1/projects/${project_name}/sql_optimization_records/${optimization_record_id}/sqls`,
      paramsData,
      options
    );
  }

  public GetOptimizationReq(
    params: IGetOptimizationReqParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const optimization_record_id = paramsData.optimization_record_id;
    delete paramsData.optimization_record_id;

    const number = paramsData.number;
    delete paramsData.number;

    return this.get<IGetOptimizationReqReturn>(
      `/v1/projects/${project_name}/sql_optimization_records/${optimization_record_id}/sqls/${number}/`,
      paramsData,
      options
    );
  }

  public getDBPerformanceImproveOverview(
    params: IGetDBPerformanceImproveOverviewParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetDBPerformanceImproveOverviewReturn>(
      `/v1/projects/${project_name}/statistic/optimization_performance_improve_overview`,
      paramsData,
      options
    );
  }

  public getOptimizationOverview(
    params: IGetOptimizationOverviewParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetOptimizationOverviewReturn>(
      `/v1/projects/${project_name}/statistic/optimization_record_overview`,
      paramsData,
      options
    );
  }
}

export default new SqlOptimizationService();
