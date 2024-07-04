import {
  IGetInstanceAuditPlansResV1,
  ICreateInstanceAuditPlanReqV1,
  IBaseRes,
  IGetInstanceAuditPlanInfoResV1,
  IUpdateInstanceAuditPlanReqV1,
  IGetAuditPlanSQLsResV1
} from '../common.d';

export interface IGetInstanceAuditPlansV1Params {
  project_name: string;

  filter_by_business?: string;

  filter_by_db_type?: string;

  filter_by_instance_name?: string;

  filter_by_audit_plan_type?: string;

  filter_by_active_status?: boolean;

  fuzzy_search?: string;

  page_index: number;

  page_size: number;
}

export interface IGetInstanceAuditPlansV1Return
  extends IGetInstanceAuditPlansResV1 {}

export interface ICreateInstanceAuditPlanV1Params
  extends ICreateInstanceAuditPlanReqV1 {
  project_name: string;
}

export interface ICreateInstanceAuditPlanV1Return extends IBaseRes {}

export interface IGetInstanceAuditPlanV1Params {
  project_name: string;

  instance_audit_plan_id: string;
}

export interface IGetInstanceAuditPlanV1Return
  extends IGetInstanceAuditPlanInfoResV1 {}

export interface IUpdateInstanceAuditPlanV1Params
  extends IUpdateInstanceAuditPlanReqV1 {
  project_name: string;

  instance_audit_plan_id: string;
}

export interface IUpdateInstanceAuditPlanV1Return extends IBaseRes {}

export interface IDeleteInstanceAuditPlanV1Params {
  project_name: string;

  instance_audit_plan_id: string;
}

export interface IDeleteInstanceAuditPlanV1Return extends IBaseRes {}

export interface IStopInstanceAuditPlanV1Params
  extends IUpdateInstanceAuditPlanReqV1 {
  project_name: string;

  instance_audit_plan_id: string;
}

export interface IStopInstanceAuditPlanV1Return extends IBaseRes {}

export interface IStopAuditPlanV1Params extends IUpdateInstanceAuditPlanReqV1 {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_type: string;
}

export interface IStopAuditPlanV1Return extends IBaseRes {}

export interface IDeleteInstanceAuditPlanByTypeV1Params {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_type: string;
}

export interface IDeleteInstanceAuditPlanByTypeV1Return extends IBaseRes {}

export interface IGetInstanceAuditPlanSQLsV1Params {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_type: string;

  page_index: number;

  page_size: number;
}

export interface IGetInstanceAuditPlanSQLsV1Return
  extends IGetAuditPlanSQLsResV1 {}
