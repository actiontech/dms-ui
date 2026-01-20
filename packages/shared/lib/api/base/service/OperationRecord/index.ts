/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetOperationRecordListParams,
  IGetOperationRecordListReturn,
  IAddOperationRecordParams,
  IAddOperationRecordReturn,
  IExportOperationRecordListParams
} from './index.d';

class OperationRecordService extends ServiceBase {
  public GetOperationRecordList(
    params: IGetOperationRecordListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetOperationRecordListReturn>(
      '/v1/dms/operation_records',
      paramsData,
      options
    );
  }

  public AddOperationRecord(
    params: IAddOperationRecordParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddOperationRecordReturn>(
      '/v1/dms/operation_records',
      paramsData,
      options
    );
  }

  public ExportOperationRecordList(
    params: IExportOperationRecordListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<any>(
      '/v1/dms/operation_records/exports',
      paramsData,
      options
    );
  }
}

export default new OperationRecordService();
