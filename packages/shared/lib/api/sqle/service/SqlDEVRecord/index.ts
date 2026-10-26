/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSqlDEVRecordListParams,
  IGetSqlDEVRecordListReturn,
  IExportSqlDevRecordsV1Params
} from './index.d';

class SqlDEVRecordService extends ServiceBase {
  public GetSqlDEVRecordList(
    params: IGetSqlDEVRecordListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSqlDEVRecordListReturn>(
      `/v1/projects/${project_name}/sql_dev_records`,
      paramsData,
      options
    );
  }

  public exportSqlDevRecordsV1(
    params: IExportSqlDevRecordsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<any>(
      `/v1/projects/${project_name}/sql_dev_records/exports`,
      paramsData,
      options
    );
  }
}

export default new SqlDEVRecordService();
