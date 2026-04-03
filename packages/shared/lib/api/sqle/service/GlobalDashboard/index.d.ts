import {
  GetGlobalAccountListV2FilterCardEnum,
  GetGlobalSqlManageTaskListV2FilterCardEnum,
  GetGlobalWorkflowListV2FilterCardEnum,
  GetGlobalWorkflowListV2WorkflowTypeEnum
} from './index.enum';

import {
  IGlobalAccountListResV2,
  IGlobalAccountStatisticsResV2,
  IGlobalSqlManageStatisticsResV2,
  IGlobalSqlManageTaskListResV2,
  IGlobalWorkflowListResV2,
  IGlobalWorkflowStatisticsResV2
} from '../common.d';

export interface IGetGlobalAccountListV2Params {
  page_index: number;

  page_size: number;

  filter_card?: GetGlobalAccountListV2FilterCardEnum;

  keyword?: string;

  filter_project_uid?: string;

  filter_instance_id?: string;
}

export interface IGetGlobalAccountListV2Return
  extends IGlobalAccountListResV2 {}

export interface IGetGlobalAccountStatisticsV2Params {
  filter_project_uid?: string;

  filter_instance_id?: string;
}

export interface IGetGlobalAccountStatisticsV2Return
  extends IGlobalAccountStatisticsResV2 {}

export interface IGetGlobalSqlManageStatisticsV2Params {
  filter_project_uid?: string;

  filter_instance_id?: string;
}

export interface IGetGlobalSqlManageStatisticsV2Return
  extends IGlobalSqlManageStatisticsResV2 {}

export interface IGetGlobalSqlManageTaskListV2Params {
  page_index: number;

  page_size: number;

  filter_card?: GetGlobalSqlManageTaskListV2FilterCardEnum;

  keyword?: string;

  filter_project_uid?: string;

  filter_instance_id?: string;
}

export interface IGetGlobalSqlManageTaskListV2Return
  extends IGlobalSqlManageTaskListResV2 {}

export interface IGetGlobalWorkflowListV2Params {
  cursor?: string;

  page_size: number;

  page_index: number;

  keyword?: string;

  filter_project_uid?: string;

  filter_instance_id?: string;

  filter_card?: GetGlobalWorkflowListV2FilterCardEnum;

  workflow_type?: GetGlobalWorkflowListV2WorkflowTypeEnum;
}

export interface IGetGlobalWorkflowListV2Return
  extends IGlobalWorkflowListResV2 {}

export interface IGetGlobalWorkflowStatisticsV2Params {
  filter_project_uid?: string;

  filter_instance_id?: string;
}

export interface IGetGlobalWorkflowStatisticsV2Return
  extends IGlobalWorkflowStatisticsResV2 {}
