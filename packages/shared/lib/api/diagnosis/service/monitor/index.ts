/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IV1ListMonitorRoutineParams,
  IV1ListMonitorRoutineReturn,
  IV1ListRoutineMetricsParams,
  IV1ListRoutineMetricsReturn
} from './index.d';

class MonitorService extends ServiceBase {
  public V1ListMonitorRoutine(
    params: IV1ListMonitorRoutineParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IV1ListMonitorRoutineReturn>(
      `/diagno/v1/projects/${project_uid}/monitor/list`,
      paramsData,
      options
    );
  }

  public V1ListRoutineMetrics(
    params: IV1ListRoutineMetricsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IV1ListRoutineMetricsReturn>(
      `/diagno/v1/projects/${project_uid}/monitor/metrics`,
      paramsData,
      options
    );
  }
}

export default new MonitorService();
