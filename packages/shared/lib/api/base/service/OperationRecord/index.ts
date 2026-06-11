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
  IExportOperationRecordListParams,
  IGetOperationTypeNameListParams,
  IGetOperationTypeNameListReturn,
  IGetOperationActionListParams,
  IGetOperationActionListReturn,
  IGetOperationUserNameListParams,
  IGetOperationUserNameListReturn
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

  public GetOperationTypeNameList(
    params?: IGetOperationTypeNameListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetOperationTypeNameListReturn>(
      '/v1/dms/operation_records/operation_type_names',
      paramsData,
      options
    );
  }

  public GetOperationActionList(
    params?: IGetOperationActionListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetOperationActionListReturn>(
      '/v1/dms/operation_records/operation_actions',
      paramsData,
      options
    );
  }

  public GetOperationUserNameList(
    params?: IGetOperationUserNameListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetOperationUserNameListReturn>(
      '/v1/dms/operation_records/operation_user_names',
      paramsData,
      options
    );
  }
}

export default new OperationRecordService();
