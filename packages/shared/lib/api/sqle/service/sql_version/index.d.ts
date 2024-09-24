import {
  IGetSqlVersionListResV1,
  ICreateSqlVersionReqV1,
  IBaseRes,
  IGetSqlVersionDetailResV1,
  IUpdateSqlVersionReqV1,
  IBatchExecuteTasksOnWorkflowReqV1,
  IBatchReleaseWorkflowReqV1,
  ILockSqlVersionReqV1,
  IRetryExecWorkflowReqV1,
  IGetWorkflowsThatCanBeAssociatedToVersionResV1,
  IBatchAssociateWorkflowsWithVersionReqV1,
  IGetDepBetweenStageInstanceResV1
} from '../common.d';

export interface IGetSqlVersionListV1Params {
  project_name: string;

  filter_by_created_at_from?: string;

  filter_by_created_at_to?: string;

  filter_by_lock_time_from?: string;

  filter_by_lock_time_to?: string;

  filter_by_version_status?: string;

  fuzzy_search?: string;

  page_index: number;

  page_size: number;
}

export interface IGetSqlVersionListV1Return extends IGetSqlVersionListResV1 {}

export interface ICreateSqlVersionV1Params extends ICreateSqlVersionReqV1 {
  project_name: string;
}

export interface ICreateSqlVersionV1Return extends IBaseRes {}

export interface IGetSqlVersionDetailV1Params {
  project_name: string;

  sql_version_id: string;
}

export interface IGetSqlVersionDetailV1Return
  extends IGetSqlVersionDetailResV1 {}

export interface IDeleteSqlVersionV1Params {
  project_name: string;

  sql_version_id: string;
}

export interface IDeleteSqlVersionV1Return extends IBaseRes {}

export interface IUpdateSqlVersionV1Params extends IUpdateSqlVersionReqV1 {
  project_name: string;

  sql_version_id: string;
}

export interface IUpdateSqlVersionV1Return extends IBaseRes {}

export interface IBatchExecuteTasksOnWorkflowV1Params
  extends IBatchExecuteTasksOnWorkflowReqV1 {
  project_name: string;

  sql_version_id: string;
}

export interface IBatchExecuteTasksOnWorkflowV1Return extends IBaseRes {}

export interface IBatchReleaseWorkflowsV1Params
  extends IBatchReleaseWorkflowReqV1 {
  project_name: string;

  sql_version_id: string;
}

export interface IBatchReleaseWorkflowsV1Return extends IBaseRes {}

export interface ILockSqlVersionV1Params extends ILockSqlVersionReqV1 {
  project_name: string;

  sql_version_id: string;
}

export interface ILockSqlVersionV1Return extends IBaseRes {}

export interface IRetryExecWorkflowV1Params extends IRetryExecWorkflowReqV1 {
  project_name: string;

  sql_version_id: string;
}

export interface IRetryExecWorkflowV1Return extends IBaseRes {}

export interface IGetWorkflowsThatCanBeAssociatedToVersionV1Params {
  project_name: string;

  sql_version_id: string;

  sql_version_stage_id: string;
}

export interface IGetWorkflowsThatCanBeAssociatedToVersionV1Return
  extends IGetWorkflowsThatCanBeAssociatedToVersionResV1 {}

export interface IBatchAssociateWorkflowsWithVersionV1Params
  extends IBatchAssociateWorkflowsWithVersionReqV1 {
  project_name: string;

  sql_version_id: string;

  sql_version_stage_id: string;
}

export interface IBatchAssociateWorkflowsWithVersionV1Return extends IBaseRes {}

export interface IGetDependenciesBetweenStageInstanceV1Params {
  project_name: string;

  sql_version_id: string;

  sql_version_stage_id: string;
}

export interface IGetDependenciesBetweenStageInstanceV1Return
  extends IGetDepBetweenStageInstanceResV1 {}
