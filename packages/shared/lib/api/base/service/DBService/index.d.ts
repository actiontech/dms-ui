import {
  ListGlobalDBServicesOrderByEnum,
  ListDBServicesOrderByEnum,
  ListDBServiceTipsFunctionalModuleEnum
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
  IImportDBServicesOfOneProjectReq,
  IGenericResp,
  IListDBServiceTipsReply,
  IUpdateDBServiceReq
} from '../common.d';

export interface IListGlobalDBServicesParams {
  page_size: number;

  page_index?: number;

  order_by?: ListGlobalDBServicesOrderByEnum;

  filter_by_business?: string;

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

  filter_by_host?: string;

  filter_by_uid?: string;

  filter_by_name?: string;

  filter_by_port?: string;

  filter_by_db_type?: string;

  project_uid: string;

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
