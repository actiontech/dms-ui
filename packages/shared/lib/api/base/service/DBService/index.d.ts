import {
  ListGlobalDBServicesOrderByEnum,
  ListGlobalDBServicesFilterLastConnectionTestStatusEnum,
  ListDBServicesOrderByEnum,
  ListDBServicesFilterLastConnectionTestStatusEnum,
  ListDBServiceTipsFunctionalModuleEnum,
  ListGlobalDBServicesV2OrderByEnum,
  ListGlobalDBServicesV2FilterLastConnectionTestStatusEnum,
  ListDBServicesV2OrderByEnum,
  ListDBServicesV2FilterLastConnectionTestStatusEnum
} from './index.enum';

import {
  IListGlobalDBServicesReply,
  IListDBServiceDriverOptionReply,
  IListGlobalDBServicesTipsReply,
  IListDBServiceReply,
  IAddDBServiceReq,
  IAddDBServiceReply,
  ICheckDBServiceIsConnectableReq,
  ICheckDBServiceIsConnectableReply,
  ICheckDBServicesIsConnectableReq,
  ICheckDBServicesIsConnectableReply,
  IImportDBServicesOfOneProjectReq,
  IGenericResp,
  IListDBServiceTipsReply,
  IUpdateDBServiceReq,
  IListGlobalDBServicesReplyV2,
  IListDBServiceReplyV2,
  IAddDBServiceReqV2,
  IImportDBServicesOfOneProjectReqV2,
  IUpdateDBServiceReqV2
} from '../common.d';

export interface IListGlobalDBServicesParams {
  page_size: number;

  page_index?: number;

  order_by?: ListGlobalDBServicesOrderByEnum;

  filter_last_connection_test_status?: ListGlobalDBServicesFilterLastConnectionTestStatusEnum;

  filter_by_business?: string;

  filter_by_environment_tag?: string;

  filter_by_host?: string;

  filter_by_uid?: string;

  filter_by_name?: string;

  filter_by_port?: string;

  filter_by_db_type?: string;

  filter_by_project_uid?: string;

  filter_by_is_enable_masking?: boolean;

  fuzzy_keyword?: string;
}

export interface IListGlobalDBServicesReturn
  extends IListGlobalDBServicesReply {}

export interface IListDBServiceDriverOptionReturn
  extends IListDBServiceDriverOptionReply {}

export interface IListGlobalDBServicesTipsReturn
  extends IListGlobalDBServicesTipsReply {}

export interface IListDBServicesParams {
  page_size: number;

  page_index?: number;

  order_by?: ListDBServicesOrderByEnum;

  filter_by_business?: string;

  filter_last_connection_test_status?: ListDBServicesFilterLastConnectionTestStatusEnum;

  filter_by_host?: string;

  filter_by_uid?: string;

  filter_by_name?: string;

  filter_by_port?: string;

  filter_by_db_type?: string;

  project_uid: string;

  filter_by_db_service_ids?: string[];

  fuzzy_keyword?: string;

  is_enable_masking?: boolean;
}

export interface IListDBServicesReturn extends IListDBServiceReply {}

export interface IAddDBServiceParams extends IAddDBServiceReq {
  project_uid: string;
}

export interface IAddDBServiceReturn extends IAddDBServiceReply {}

export interface ICheckDBServiceIsConnectableParams
  extends ICheckDBServiceIsConnectableReq {
  project_uid: string;
}

export interface ICheckDBServiceIsConnectableReturn
  extends ICheckDBServiceIsConnectableReply {}

export interface ICheckProjectDBServicesConnectionsParams
  extends ICheckDBServicesIsConnectableReq {
  project_uid: string;
}

export interface ICheckProjectDBServicesConnectionsReturn
  extends ICheckDBServicesIsConnectableReply {}

export interface IImportDBServicesOfOneProjectParams
  extends IImportDBServicesOfOneProjectReq {
  project_uid: string;
}

export interface IImportDBServicesOfOneProjectReturn extends IGenericResp {}

export interface IImportDBServicesOfOneProjectCheckParams {
  project_uid: string;

  db_services_file?: any;
}

export interface IListDBServiceTipsParams {
  project_uid: string;

  filter_db_type?: string;

  functional_module?: ListDBServiceTipsFunctionalModuleEnum;
}

export interface IListDBServiceTipsReturn extends IListDBServiceTipsReply {}

export interface IUpdateDBServiceParams extends IUpdateDBServiceReq {
  project_uid: string;

  db_service_uid: string;
}

export interface IUpdateDBServiceReturn extends IGenericResp {}

export interface IDelDBServiceParams {
  project_uid: string;

  db_service_uid: string;
}

export interface IDelDBServiceReturn extends IGenericResp {}

export interface ICheckDBServiceIsConnectableByIdParams {
  project_uid: string;

  db_service_uid: string;
}

export interface ICheckDBServiceIsConnectableByIdReturn
  extends ICheckDBServiceIsConnectableReply {}

export interface IListGlobalDBServicesV2Params {
  page_size: number;

  page_index?: number;

  order_by?: ListGlobalDBServicesV2OrderByEnum;

  filter_last_connection_test_status?: ListGlobalDBServicesV2FilterLastConnectionTestStatusEnum;

  filter_by_business?: string;

  filter_by_environment_tag?: string;

  filter_by_host?: string;

  filter_by_uid?: string;

  filter_by_name?: string;

  filter_by_port?: string;

  filter_by_db_type?: string;

  filter_by_project_uid?: string;

  filter_by_is_enable_masking?: boolean;

  fuzzy_keyword?: string;
}

export interface IListGlobalDBServicesV2Return
  extends IListGlobalDBServicesReplyV2 {}

export interface IListDBServicesV2Params {
  page_size: number;

  page_index?: number;

  order_by?: ListDBServicesV2OrderByEnum;

  filter_last_connection_test_status?: ListDBServicesV2FilterLastConnectionTestStatusEnum;

  filter_by_host?: string;

  filter_by_uid?: string;

  filter_by_name?: string;

  filter_by_port?: string;

  filter_by_db_type?: string;

  project_uid: string;

  filter_by_db_service_ids?: string[];

  filter_by_environment_tag?: string;

  fuzzy_keyword?: string;

  is_enable_masking?: boolean;
}

export interface IListDBServicesV2Return extends IListDBServiceReplyV2 {}

export interface IAddDBServiceV2Params extends IAddDBServiceReqV2 {
  project_uid: string;
}

export interface IAddDBServiceV2Return extends IAddDBServiceReply {}

export interface IImportDBServicesOfOneProjectV2Params
  extends IImportDBServicesOfOneProjectReqV2 {
  project_uid: string;
}

export interface IImportDBServicesOfOneProjectV2Return extends IGenericResp {}

export interface IImportDBServicesOfOneProjectCheckV2Params {
  project_uid: string;

  db_services_file?: any;
}

export interface IUpdateDBServiceV2Params extends IUpdateDBServiceReqV2 {
  project_uid: string;

  db_service_uid: string;
}

export interface IUpdateDBServiceV2Return extends IGenericResp {}
