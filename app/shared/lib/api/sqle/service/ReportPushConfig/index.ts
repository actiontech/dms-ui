/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetReportPushConfigListParams,
  IGetReportPushConfigListReturn,
  IUpdateReportPushConfigParams,
  IUpdateReportPushConfigReturn
} from './index.d';

class ReportPushConfigService extends ServiceBase {
  public GetReportPushConfigList(
    params: IGetReportPushConfigListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetReportPushConfigListReturn>(
      `/v1/projects/${project_name}/report_push_configs`,
      paramsData,
      options
    );
  }

  public UpdateReportPushConfig(
    params: IUpdateReportPushConfigParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const report_push_config_id = paramsData.report_push_config_id;
    delete paramsData.report_push_config_id;

    return this.put<IUpdateReportPushConfigReturn>(
      `/v1/projects/${project_name}/report_push_configs/${report_push_config_id}/`,
      paramsData,
      options
    );
  }
}

export default new ReportPushConfigService();
