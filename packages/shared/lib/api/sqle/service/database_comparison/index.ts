/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetComparisonStatementV1Params,
  IGetComparisonStatementV1Return,
  IExecuteDatabaseComparisonV1Params,
  IExecuteDatabaseComparisonV1Return,
  IGenDatabaseDiffModifySQLsV1Params,
  IGenDatabaseDiffModifySQLsV1Return
} from './index.d';

class DatabaseComparisonService extends ServiceBase {
  public getComparisonStatementV1(
    params: IGetComparisonStatementV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IGetComparisonStatementV1Return>(
      `/v1/projects/${project_name}/database_comparison/comparison_statements`,
      paramsData,
      options
    );
  }

  public executeDatabaseComparisonV1(
    params: IExecuteDatabaseComparisonV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IExecuteDatabaseComparisonV1Return>(
      `/v1/projects/${project_name}/database_comparison/execute_comparison`,
      paramsData,
      options
    );
  }

  public genDatabaseDiffModifySQLsV1(
    params: IGenDatabaseDiffModifySQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IGenDatabaseDiffModifySQLsV1Return>(
      `/v1/projects/${project_name}/database_comparison/modify_sql_statements`,
      paramsData,
      options
    );
  }
}

export default new DatabaseComparisonService();
