/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetInstanceAuditPlansV1Params,
  IGetInstanceAuditPlansV1Return,
  ICreateInstanceAuditPlanV1Params,
  ICreateInstanceAuditPlanV1Return,
  IGetInstanceAuditPlanV1Params,
  IGetInstanceAuditPlanV1Return,
  IUpdateInstanceAuditPlanV1Params,
  IUpdateInstanceAuditPlanV1Return,
  IDeleteInstanceAuditPlanV1Params,
  IDeleteInstanceAuditPlanV1Return,
  IStopInstanceAuditPlanV1Params,
  IStopInstanceAuditPlanV1Return,
  IGetInstanceAuditPlanOverviewV1Params,
  IGetInstanceAuditPlanOverviewV1Return,
  IStopAuditPlanV1Params,
  IStopAuditPlanV1Return,
  IDeleteInstanceAuditPlanByTypeV1Params,
  IDeleteInstanceAuditPlanByTypeV1Return,
  IGetInstanceAuditPlanSQLsV1Params,
  IGetInstanceAuditPlanSQLsV1Return
} from './index.d';

class InstanceAuditPlanService extends ServiceBase {
  public getInstanceAuditPlansV1(
    params: IGetInstanceAuditPlansV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetInstanceAuditPlansV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans`,
      paramsData,
      options
    );
  }

  public createInstanceAuditPlanV1(
    params: ICreateInstanceAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateInstanceAuditPlanV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans`,
      paramsData,
      options
    );
  }

  public getInstanceAuditPlanV1(
    params: IGetInstanceAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    return this.get<IGetInstanceAuditPlanV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}`,
      paramsData,
      options
    );
  }

  public updateInstanceAuditPlanV1(
    params: IUpdateInstanceAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    return this.put<IUpdateInstanceAuditPlanV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}/`,
      paramsData,
      options
    );
  }

  public deleteInstanceAuditPlanV1(
    params: IDeleteInstanceAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    return this.delete<IDeleteInstanceAuditPlanV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}/`,
      paramsData,
      options
    );
  }

  public stopInstanceAuditPlanV1(
    params: IStopInstanceAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    return this.patch<IStopInstanceAuditPlanV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}/`,
      paramsData,
      options
    );
  }

  public getInstanceAuditPlanOverviewV1(
    params: IGetInstanceAuditPlanOverviewV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    return this.get<IGetInstanceAuditPlanOverviewV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}/audit_plans`,
      paramsData,
      options
    );
  }

  public stopAuditPlanV1(
    params: IStopAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    const audit_plan_type = paramsData.audit_plan_type;
    delete paramsData.audit_plan_type;

    return this.patch<IStopAuditPlanV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}/audit_plans/${audit_plan_type}`,
      paramsData,
      options
    );
  }

  public deleteInstanceAuditPlanByTypeV1(
    params: IDeleteInstanceAuditPlanByTypeV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    const audit_plan_type = paramsData.audit_plan_type;
    delete paramsData.audit_plan_type;

    return this.delete<IDeleteInstanceAuditPlanByTypeV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}/audit_plans/${audit_plan_type}/`,
      paramsData,
      options
    );
  }

  public getInstanceAuditPlanSQLsV1(
    params: IGetInstanceAuditPlanSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    const audit_plan_type = paramsData.audit_plan_type;
    delete paramsData.audit_plan_type;

    return this.get<IGetInstanceAuditPlanSQLsV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}/audit_plans/${audit_plan_type}/sqls`,
      paramsData,
      options
    );
  }
}

export default new InstanceAuditPlanService();
