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
  IGetOptimizationReqReturn
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
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IOptimizeSQLReqReturn>(
      `/v1/projects/${project_name}/sql_optimization_records`,
      paramsData,
      options
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
}

export default new SqlOptimizationService();
