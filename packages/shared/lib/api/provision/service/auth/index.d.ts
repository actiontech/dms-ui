import {
  AuditListAuthorizationEventsOrderByEnum,
  AuditListDataObjectServiceEventsOrderByEnum,
  AuditListDataPermissionTemplateEventsOrderByEnum,
  AuthListAuthorizationOrderByEnum,
  AuthListAuthorizationFilterByStatusEnum,
  ListTipsByAuthorizationKeyKeyEnum,
  AuthListDBAccountByAuthorizationOrderByEnum,
  AuthListDataObjectSourcesOrderByEnum,
  AuthListDataOperationSetsOrderByEnum,
  AuthListDataOperationSetsFilterByDbTypeEnum,
  AuthListDataPermissionTemplateOrderByEnum,
  OperateDataResourceHandleDataResourceTypeEnum,
  OperateDataResourceHandleOperationTypeEnum,
  OperateDataResourceHandleOperationTimingEnum,
  AuthListDatabaseOrderByEnum,
  AuthListOperationsOrderByEnum,
  AuthListServiceOrderByEnum,
  AuthListTableOrderByEnum
} from './index.enum';

import {
  IListAuthorizationEventsReply,
  IListDataObjectServiceEventsReply,
  IListDataPermissionTemplateEventsReply,
  IListAuthorizationReply,
  IAddAuthorization,
  IAddAuthorizationReply,
  IListTipsByAuthorizationKeyReply,
  IGetAuthorizationReply,
  IUpdateAuthorization,
  IGenericResp,
  IListDBAccountByAuthReply,
  IListDataObjectSourcesReply,
  IAddDataObjectSource,
  IAddDataObjectSourceReply,
  IUpdateDataObjectSource,
  IDelDataObjectSource,
  IListDataOperationSetsReply,
  IListDataPermissionTemplateReply,
  IAddDataPermissionTemplate,
  IAddDataPermissionTemplateReply,
  IUpdateDataPermissionTemplate,
  IUpdateDataPermissionTemplateReply,
  ICopyDataPermissionTemplate,
  ICopyDataPermissionTemplateReply,
  IGetDataPermissionsInDataPermissionTemplateReply,
  IGetStatementsByDataPermissionTemplateReply,
  IListDatabaseReply,
  IListOperationsReply,
  IListServiceReply,
  IAddServiceReply,
  IListBusinessFromDBServiceReply,
  IIPluginDBService,
  IUpdateService,
  IGetUsersFromDBServiceReply,
  IListTableReply,
  IListInternalUserReply
} from '../common.d';

export interface IAuditListAuthorizationEventsParams {
  page_size: number;

  page_index?: number;

  order_by?: AuditListAuthorizationEventsOrderByEnum;

  filter_by_permission_user?: string;

  keyword?: string;

  filter_by_create_user?: string;

  filter_by_event_type?: string;

  filter_by_generated_time_start?: string;

  filter_by_generated_time_end?: string;

  filter_by_event_uid?: string;

  filter_by_namespace_uid?: string;
}

export interface IAuditListAuthorizationEventsReturn
  extends IListAuthorizationEventsReply {}

export interface IAuditListDataObjectServiceEventsParams {
  page_size: number;

  page_index?: number;

  order_by?: AuditListDataObjectServiceEventsOrderByEnum;

  filter_by_business?: string;

  filter_by_data_object_service_name?: string;

  keyword?: string;

  filter_by_generated_time_start?: string;

  filter_by_generated_time_end?: string;

  filter_by_event_uid?: string;

  filter_by_namespace_uid?: string;
}

export interface IAuditListDataObjectServiceEventsReturn
  extends IListDataObjectServiceEventsReply {}

export interface IAuditListDataPermissionTemplateEventsParams {
  page_size: number;

  page_index?: number;

  order_by?: AuditListDataPermissionTemplateEventsOrderByEnum;

  keyword?: string;

  filter_by_data_object_service_name?: string;

  filter_by_create_user?: string;

  filter_by_event_type?: string;

  filter_by_generated_time_start?: string;

  filter_by_generated_time_end?: string;

  filter_by_event_uid?: string;

  filter_by_namespace_uid?: string;
}

export interface IAuditListDataPermissionTemplateEventsReturn
  extends IListDataPermissionTemplateEventsReply {}

export interface IAuthListAuthorizationParams {
  page_size: number;

  page_index?: number;

  order_by?: AuthListAuthorizationOrderByEnum;

  filter_by_purpose?: string;

  filter_by_business?: string;

  filter_by_status?: AuthListAuthorizationFilterByStatusEnum;

  filter_by_data_object_service_dns?: string;

  keyword?: string;

  filter_by_namespace_uid: string;
}

export interface IAuthListAuthorizationReturn extends IListAuthorizationReply {}

export interface IAuthAddAuthorizationParams {
  authorization?: IAddAuthorization;
}

export interface IAuthAddAuthorizationReturn extends IAddAuthorizationReply {}

export interface IListTipsByAuthorizationKeyParams {
  key?: ListTipsByAuthorizationKeyKeyEnum;
}

export interface IListTipsByAuthorizationKeyReturn
  extends IListTipsByAuthorizationKeyReply {}

export interface IAuthGetAuthorizationParams {
  authorization_uid: string;
}

export interface IAuthGetAuthorizationReturn extends IGetAuthorizationReply {}

export interface IAuthUpdateAuthorizationParams {
  authorization_uid: string;

  authorization?: IUpdateAuthorization;
}

export interface IAuthUpdateAuthorizationReturn extends IGenericResp {}

export interface IAuthDelAuthorizationParams {
  authorization_uid: string;
}

export interface IAuthDelAuthorizationReturn extends IGenericResp {}

export interface IAuthAddDataPermissionTemplateToAuthorizationParams {
  authorization_uid: string;

  data_permission_template_uid: string;

  effective_time_day?: number;
}

export interface IAuthAddDataPermissionTemplateToAuthorizationReturn
  extends IGenericResp {}

export interface IAuthListDBAccountByAuthorizationParams {
  authorization_uid: string;

  page_size: number;

  page_index?: number;

  order_by?: AuthListDBAccountByAuthorizationOrderByEnum;

  keyword?: string;
}

export interface IAuthListDBAccountByAuthorizationReturn
  extends IListDBAccountByAuthReply {}

export interface IAuthListDataObjectSourcesParams {
  page_size: number;

  page_index?: number;

  order_by?: AuthListDataObjectSourcesOrderByEnum;

  keyword?: string;
}

export interface IAuthListDataObjectSourcesReturn
  extends IListDataObjectSourcesReply {}

export interface IAuthAddDataObjectSourceParams {
  source?: IAddDataObjectSource;
}

export interface IAuthAddDataObjectSourceReturn
  extends IAddDataObjectSourceReply {}

export interface IAuthUpdateDataObjectSourceParams {
  uid: string;

  source?: IUpdateDataObjectSource;
}

export interface IAuthUpdateDataObjectSourceReturn extends IGenericResp {}

export interface IAuthDelDataObjectSourceParams {
  uid: string;

  del_data_object_source?: IDelDataObjectSource;
}

export interface IAuthDelDataObjectSourceReturn extends IGenericResp {}

export interface IAuthSyncFromDataObjectSourceParams {
  uid: string;
}

export interface IAuthSyncFromDataObjectSourceReturn extends IGenericResp {}

export interface IAuthListDataOperationSetsParams {
  data_object_uids?: string[];

  page_size: number;

  page_index?: number;

  order_by?: AuthListDataOperationSetsOrderByEnum;

  keyword?: string;

  filter_by_field_name?: string;

  filter_by_db_type?: AuthListDataOperationSetsFilterByDbTypeEnum;
}

export interface IAuthListDataOperationSetsReturn
  extends IListDataOperationSetsReply {}

export interface IAuthListDataPermissionTemplateParams {
  page_size: number;

  page_index?: number;

  order_by?: AuthListDataPermissionTemplateOrderByEnum;

  filter_by_name?: string;

  filter_by_namespace_uid: string;

  keyword?: string;
}

export interface IAuthListDataPermissionTemplateReturn
  extends IListDataPermissionTemplateReply {}

export interface IAuthAddDataPermissionTemplateParams {
  template?: IAddDataPermissionTemplate;
}

export interface IAuthAddDataPermissionTemplateReturn
  extends IAddDataPermissionTemplateReply {}

export interface IAuthUpdateDataPermissionTemplateParams {
  data_permission_template_uid: string;

  template?: IUpdateDataPermissionTemplate;
}

export interface IAuthUpdateDataPermissionTemplateReturn
  extends IUpdateDataPermissionTemplateReply {}

export interface IAuthDelDataPermissionTemplateParams {
  data_permission_template_uid: string;
}

export interface IAuthDelDataPermissionTemplateReturn extends IGenericResp {}

export interface IAuthCopyDataPermissionTemplateParams {
  data_permission_template_uid: string;

  new_template?: ICopyDataPermissionTemplate;
}

export interface IAuthCopyDataPermissionTemplateReturn
  extends ICopyDataPermissionTemplateReply {}

export interface IAuthGetDataPermissionsInDataPermissionTemplateParams {
  data_permission_template_uid: string;
}

export interface IAuthGetDataPermissionsInDataPermissionTemplateReturn
  extends IGetDataPermissionsInDataPermissionTemplateReply {}

export interface IAuthGetStatementByDataPermissionTemplatesParams {
  data_permission_template_uid: string;

  db_account_username: string;

  db_account_password: string;

  db_account_hostname: string;
}

export interface IAuthGetStatementByDataPermissionTemplatesReturn
  extends IGetStatementsByDataPermissionTemplateReply {}

export interface IAuthVerifyDBAccountParams {
  data_permission_template_uid: string;

  username: string;

  hostname: string;
}

export interface IAuthVerifyDBAccountReturn extends IGenericResp {}

export interface IOperateDataResourceHandleParams {
  data_resource_uid?: string;

  data_resource_type?: OperateDataResourceHandleDataResourceTypeEnum;

  operation_type?: OperateDataResourceHandleOperationTypeEnum;

  operation_timing?: OperateDataResourceHandleOperationTimingEnum;
}

export interface IOperateDataResourceHandleReturn extends IGenericResp {}

export interface IAuthListDatabaseParams {
  service_uid?: string;

  page_size: number;

  page_index?: number;

  order_by?: AuthListDatabaseOrderByEnum;

  keyword?: string;
}

export interface IAuthListDatabaseReturn extends IListDatabaseReply {}

export interface IAuthListOperationsParams {
  data_object_uids?: string[];

  page_size: number;

  page_index?: number;

  order_by?: AuthListOperationsOrderByEnum;

  keyword?: string;
}

export interface IAuthListOperationsReturn extends IListOperationsReply {}

export interface IAuthListServiceParams {
  page_size: number;

  page_index?: number;

  order_by?: AuthListServiceOrderByEnum;

  business?: string;

  filter_by_address?: string;

  filter_by_db_type?: string;

  filter_by_user?: string;

  filter_by_namespace?: string;

  keyword?: string;
}

export interface IAuthListServiceReturn extends IListServiceReply {}

export interface IAddServiceReturn extends IAddServiceReply {}

export interface IAuthListBusinessParams {
  namespace_uid?: string;
}

export interface IAuthListBusinessReturn
  extends IListBusinessFromDBServiceReply {}

export interface IAddDBServicePreCheckParams {
  db_service?: IIPluginDBService;
}

export interface IAddDBServicePreCheckReturn extends IGenericResp {}

export interface IDelDBServicePreCheckParams {
  db_service_uid?: string;
}

export interface IDelDBServicePreCheckReturn extends IGenericResp {}

export interface IAuthSyncServiceParams {
  service_uids: string[];
}

export interface IAuthSyncServiceReturn extends IGenericResp {}

export interface IAuthUpdateServiceParams {
  service_uid: string;

  service?: IUpdateService;
}

export interface IAuthUpdateServiceReturn extends IGenericResp {}

export interface IAuthDelServiceParams {
  service_uid: string;
}

export interface IAuthDelServiceReturn extends IGenericResp {}

export interface IAuthGetUsersFromDBServiceParams {
  service_uid: string;
}

export interface IAuthGetUsersFromDBServiceReturn
  extends IGetUsersFromDBServiceReply {}

export interface IAuthListTableParams {
  database_uid: string;

  page_size: number;

  page_index?: number;

  order_by?: AuthListTableOrderByEnum;

  keyword?: string;
}

export interface IAuthListTableReturn extends IListTableReply {}

export interface IDelUserGroupPreCheckParams {
  user_group_uid?: string;
}

export interface IDelUserGroupPreCheckReturn extends IGenericResp {}

export interface IAuthListUserParams {
  page_size: number;

  page_index?: number;

  namespace_uid?: string;
}

export interface IAuthListUserReturn extends IListInternalUserReply {}

export interface IDelUserPreCheckParams {
  user_uid?: string;
}

export interface IDelUserPreCheckReturn extends IGenericResp {}
