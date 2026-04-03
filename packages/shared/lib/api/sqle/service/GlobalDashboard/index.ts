/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetGlobalAccountListV2Params,
  IGetGlobalAccountListV2Return,
  IGetGlobalAccountStatisticsV2Params,
  IGetGlobalAccountStatisticsV2Return,
  IGetGlobalSqlManageStatisticsV2Params,
  IGetGlobalSqlManageStatisticsV2Return,
  IGetGlobalSqlManageTaskListV2Params,
  IGetGlobalSqlManageTaskListV2Return,
  IGetGlobalWorkflowListV2Params,
  IGetGlobalWorkflowListV2Return,
  IGetGlobalWorkflowStatisticsV2Params,
  IGetGlobalWorkflowStatisticsV2Return
} from './index.d';

class GlobalDashboardService extends ServiceBase {
  public GetGlobalAccountListV2(
    params: IGetGlobalAccountListV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetGlobalAccountListV2Return>(
      '/v2/dashboard/accounts',
      paramsData,
      options
    );
  }

  public GetGlobalAccountStatisticsV2(
    params: IGetGlobalAccountStatisticsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetGlobalAccountStatisticsV2Return>(
      '/v2/dashboard/accounts/statistics',
      paramsData,
      options
    );
  }

  public GetGlobalSqlManageStatisticsV2(
    params: IGetGlobalSqlManageStatisticsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetGlobalSqlManageStatisticsV2Return>(
      '/v2/dashboard/sql_manage/statistics',
      paramsData,
      options
    );
  }

  public GetGlobalSqlManageTaskListV2(
    params: IGetGlobalSqlManageTaskListV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetGlobalSqlManageTaskListV2Return>(
      '/v2/dashboard/sql_manage/tasks',
      paramsData,
      options
    );
  }

  public GetGlobalWorkflowListV2(
    params: IGetGlobalWorkflowListV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetGlobalWorkflowListV2Return>(
      '/v2/dashboard/workflows',
      paramsData,
      options
    );
  }

  public GetGlobalWorkflowStatisticsV2(
    params: IGetGlobalWorkflowStatisticsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetGlobalWorkflowStatisticsV2Return>(
      '/v2/dashboard/workflows/statistics',
      paramsData,
      options
    );
  }
}

export default new GlobalDashboardService();
