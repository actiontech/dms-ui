/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListCBOperationLogsParams,
  IListCBOperationLogsReturn,
  IExportCBOperationLogsParams,
  IGetCBOperationLogTipsParams,
  IGetCBOperationLogTipsReturn
} from './index.d';

class CBOperationLogsService extends ServiceBase {
  public ListCBOperationLogs(
    params: IListCBOperationLogsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListCBOperationLogsReturn>(
      `/v1/dms/projects/${project_uid}/cb_operation_logs`,
      paramsData,
      options
    );
  }

  public ExportCBOperationLogs(
    params: IExportCBOperationLogsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get(
      `/v1/dms/projects/${project_uid}/cb_operation_logs/export`,
      paramsData,
      options
    );
  }

  public GetCBOperationLogTips(
    params: IGetCBOperationLogTipsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IGetCBOperationLogTipsReturn>(
      `/v1/dms/projects/${project_uid}/cb_operation_logs/tips`,
      paramsData,
      options
    );
  }
}

export default new CBOperationLogsService();
