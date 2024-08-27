import {
  IGetAuditPlanSQLDataReqV1,
  IGetAuditPlanSQLDataResV1,
  IGetAuditPlanSQLMetaResV1,
  IGetInstanceAuditPlansResV1,
  ICreateInstanceAuditPlanReqV1,
  ICreatInstanceAuditPlanResV1,
  IGetInstanceAuditPlanDetailResV1,
  IUpdateInstanceAuditPlanReqV1,
  IBaseRes,
  IUpdateInstanceAuditPlanStatusReqV1,
  IGetInstanceAuditPlanOverviewResV1,
  IUpdateAuditPlanStatusReqV1,
  IGetAuditPlanSQLExportReqV1,
  IGetAuditPlanSQLsResV1,
  IGetSqlManageSqlAnalysisResp,
  IUploadInstanceAuditPlanSQLsReqV2
} from '../common.d';

export interface IGetAuditPlanSQLDataV1Params
  extends IGetAuditPlanSQLDataReqV1 {
  project_name: string;

  audit_plan_id: string;
}

export interface IGetAuditPlanSQLDataV1Return
  extends IGetAuditPlanSQLDataResV1 {}

export interface IGetAuditPlanSQLMetaV1Params {
  project_name: string;

  audit_plan_id: string;
}

export interface IGetAuditPlanSQLMetaV1Return
  extends IGetAuditPlanSQLMetaResV1 {}

export interface IGetInstanceAuditPlansV1Params {
  project_name: string;

  filter_by_business?: string;

  filter_by_db_type?: string;

  filter_by_instance_id?: string;

  filter_by_audit_plan_type?: string;

  filter_by_active_status?: string;

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

export interface ICreateInstanceAuditPlanV1Return
  extends ICreatInstanceAuditPlanResV1 {}

export interface IGetInstanceAuditPlanDetailV1Params {
  project_name: string;

  instance_audit_plan_id: string;
}

export interface IGetInstanceAuditPlanDetailV1Return
  extends IGetInstanceAuditPlanDetailResV1 {}

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

export interface IUpdateInstanceAuditPlanStatusV1Params
  extends IUpdateInstanceAuditPlanStatusReqV1 {
  project_name: string;

  instance_audit_plan_id: string;
}

export interface IUpdateInstanceAuditPlanStatusV1Return extends IBaseRes {}

export interface IGetInstanceAuditPlanOverviewV1Params {
  project_name: string;

  instance_audit_plan_id: string;
}

export interface IGetInstanceAuditPlanOverviewV1Return
  extends IGetInstanceAuditPlanOverviewResV1 {}

export interface IDeleteAuditPlanByTypeV1Params {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_id: string;
}

export interface IDeleteAuditPlanByTypeV1Return extends IBaseRes {}

export interface IUpdateAuditPlanStatusV1Params
  extends IUpdateAuditPlanStatusReqV1 {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_id: string;
}

export interface IUpdateAuditPlanStatusV1Return extends IBaseRes {}

export interface IAuditPlanTriggerSqlAuditV1Params {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_id: string;
}

export interface IAuditPlanTriggerSqlAuditV1Return extends IBaseRes {}

export interface IGetInstanceAuditPlanSQLDataV1Params
  extends IGetAuditPlanSQLDataReqV1 {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_id: string;
}

export interface IGetInstanceAuditPlanSQLDataV1Return
  extends IGetAuditPlanSQLDataResV1 {}

export interface IGetInstanceAuditPlanSQLExportV1Params
  extends IGetAuditPlanSQLExportReqV1 {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_id: string;
}

export interface IGetInstanceAuditPlanSQLMetaV1Params {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_id: string;
}

export interface IGetInstanceAuditPlanSQLMetaV1Return
  extends IGetAuditPlanSQLMetaResV1 {}

export interface IGetInstanceAuditPlanSQLsV1Params {
  project_name: string;

  instance_audit_plan_id: string;

  audit_plan_id: string;

  page_index: number;

  page_size: number;
}

export interface IGetInstanceAuditPlanSQLsV1Return
  extends IGetAuditPlanSQLsResV1 {}

export interface IGetAuditPlanSqlAnalysisDataV1Params {
  project_name: string;

  instance_audit_plan_id: string;

  id: string;
}

export interface IGetAuditPlanSqlAnalysisDataV1Return
  extends IGetSqlManageSqlAnalysisResp {}

export interface IUploadInstanceAuditPlanSQLsV2Params
  extends IUploadInstanceAuditPlanSQLsReqV2 {
  project_name: string;

  audit_plan_id: string;
}

export interface IUploadInstanceAuditPlanSQLsV2Return extends IBaseRes {}
