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
  IGetInstanceAuditPlanDetailV1Params,
  IGetInstanceAuditPlanDetailV1Return,
  IUpdateInstanceAuditPlanV1Params,
  IUpdateInstanceAuditPlanV1Return,
  IDeleteInstanceAuditPlanV1Params,
  IDeleteInstanceAuditPlanV1Return,
  IUpdateInstanceAuditPlanStatusV1Params,
  IUpdateInstanceAuditPlanStatusV1Return,
  IGetInstanceAuditPlanOverviewV1Params,
  IGetInstanceAuditPlanOverviewV1Return,
  IUpdateAuditPlanStatusV1Params,
  IUpdateAuditPlanStatusV1Return,
  IDeleteAuditPlanByTypeV1Params,
  IDeleteAuditPlanByTypeV1Return,
  IGetInstanceAuditPlanSQLsV1Params,
  IGetInstanceAuditPlanSQLsV1Return,
  IUploadInstanceAuditPlanSQLsV2Params,
  IUploadInstanceAuditPlanSQLsV2Return
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

  public getInstanceAuditPlanDetailV1(
    params: IGetInstanceAuditPlanDetailV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    return this.get<IGetInstanceAuditPlanDetailV1Return>(
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

  public updateInstanceAuditPlanStatusV1(
    params: IUpdateInstanceAuditPlanStatusV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    return this.patch<IUpdateInstanceAuditPlanStatusV1Return>(
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

  public updateAuditPlanStatusV1(
    params: IUpdateAuditPlanStatusV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    const audit_plan_type = paramsData.audit_plan_type;
    delete paramsData.audit_plan_type;

    return this.patch<IUpdateAuditPlanStatusV1Return>(
      `/v1/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}/audit_plans/${audit_plan_type}`,
      paramsData,
      options
    );
  }

  public deleteAuditPlanByTypeV1(
    params: IDeleteAuditPlanByTypeV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    const audit_plan_type = paramsData.audit_plan_type;
    delete paramsData.audit_plan_type;

    return this.delete<IDeleteAuditPlanByTypeV1Return>(
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

  public UploadInstanceAuditPlanSQLsV2(
    params: IUploadInstanceAuditPlanSQLsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_audit_plan_id = paramsData.instance_audit_plan_id;
    delete paramsData.instance_audit_plan_id;

    const audit_plan_type = paramsData.audit_plan_type;
    delete paramsData.audit_plan_type;

    return this.post<IUploadInstanceAuditPlanSQLsV2Return>(
      `/v2/projects/${project_name}/instance_audit_plans/${instance_audit_plan_id}/audit_plan_type/${audit_plan_type}/sqls/upload`,
      paramsData,
      options
    );
  }
}

export default new InstanceAuditPlanService();
