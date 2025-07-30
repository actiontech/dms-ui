/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSqlPerformanceInsightsParams,
  IGetSqlPerformanceInsightsReturn,
  IGetSqlPerformanceInsightsRelatedSQLParams,
  IGetSqlPerformanceInsightsRelatedSQLReturn,
  IGetSqlPerformanceInsightsRelatedTransactionParams,
  IGetSqlPerformanceInsightsRelatedTransactionReturn
} from './index.d';

class SqlInsightService extends ServiceBase {
  public GetSqlPerformanceInsights(
    params: IGetSqlPerformanceInsightsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSqlPerformanceInsightsReturn>(
      `/v1/projects/${project_name}/sql_performance_insights`,
      paramsData,
      options
    );
  }

  public GetSqlPerformanceInsightsRelatedSQL(
    params: IGetSqlPerformanceInsightsRelatedSQLParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSqlPerformanceInsightsRelatedSQLReturn>(
      `/v1/projects/${project_name}/sql_performance_insights/related_sql`,
      paramsData,
      options
    );
  }

  public GetSqlPerformanceInsightsRelatedTransaction(
    params: IGetSqlPerformanceInsightsRelatedTransactionParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSqlPerformanceInsightsRelatedTransactionReturn>(
      `/v1/projects/${project_name}/sql_performance_insights/related_sql/related_transaction`,
      paramsData,
      options
    );
  }
}

export default new SqlInsightService();
