import {
  ViewDatabaseReplyStatusEnum,
  ViewServerReplyStatusEnum
} from './common.enum';

export interface IGenericResp {
  code?: number;

  message?: string;
}

export interface IDeleteDBsReq {
  db_monitor_ids: number[];
}

export interface IDeleteServersReq {
  server_ids?: number[];
}

export interface IGetRoleReply {
  code?: number;

  data?: IViewRoleReply;

  message?: string;
}

export interface IGetServerHostnameReply {
  code?: number;

  hostname?: string;

  message?: string;
}

export interface IGetUserReply {
  code?: number;

  data?: IViewUserReply;

  message?: string;
}

export interface IListDBsReply {
  code?: number;

  data?: IViewDatabaseReply[];

  message?: string;

  total_nums?: number;
}

export interface IListMonitorRoutineReply {
  code?: number;

  data?: IViewMonitorConfigReply[];

  message?: string;

  total_nums?: number;
}

export interface IListRolesReply {
  code?: number;

  data?: IViewRoleReply[];

  message?: string;

  total_nums?: number;
}

export interface IListRoutineMetricsReply {
  code?: number;

  data?: IRoutienMetrics;

  message?: string;

  total_nums?: number;
}

export interface IListScopesReply {
  code?: number;

  data?: IViewScope[];

  message?: string;

  total_nums?: number;
}

export interface IListServersReply {
  code?: number;

  data?: IViewServerReply[];

  message?: string;

  total_nums?: number;
}

export interface IListUsersReply {
  code?: number;

  data?: IViewUserReply[];

  message?: string;

  total_nums?: number;
}

export interface IRoleCreateRequest {
  role_desc?: string;

  role_name?: string;
}

export interface IRoleDeleteRequest {
  role_id?: number;
}

export interface IRoleScopeCreateRequest {
  role_id?: number;

  scope_name?: string;
}

export interface IRoleScopeDeleteRequest {
  role_id?: number;

  scope_name?: string;
}

export interface IRoutienMetrics {
  metrics?: Array<{
    desc?: string;

    metric_key?: string;
  }>;

  routine_id?: number;
}

export interface ISaveDBsReq {
  dbs: IViewDatabase[];
}

export interface IUserCreateRequest {
  password?: string;

  role_id?: number;

  username?: string;
}

export interface IUserDeleteRequest {
  user_id?: number;
}

export interface IUserLoginReply {
  code?: number;

  message?: string;

  token?: string;

  user_id?: number;
}

export interface IUserLoginRequest {
  password?: string;

  username?: string;
}

export interface IUserUpdatePasswordRequest {
  password?: string;

  user_id?: number;
}

export interface IUserUpdateRoleRequest {
  role_id?: number;

  user_id?: number;
}

export interface IViewAddServerRequest {
  servers?: IViewServer[];
}

export interface IViewDatabase {
  datasource_name: string;

  datasource_uid: string;

  db_type: string;

  host: string;

  monitor_name: string;

  port: number;
}

export interface IViewDatabaseReply {
  created_at?: string;

  datasource_name: string;

  datasource_uid: string;

  db_type: string;

  host: string;

  monitor_name: string;

  port: number;

  status?: ViewDatabaseReplyStatusEnum;
}

export interface IViewMonitorConfigReply {
  desc?: string;

  enable?: boolean;

  id?: number;

  interval?: number;

  routine_name?: string;

  via?: string;
}

export interface IViewRoleReply {
  id?: number;

  role_desc?: string;

  role_name?: string;
}

export interface IViewScope {
  scope_desc?: string;

  scope_name?: string;
}

export interface IViewServer {
  host: string;

  name: string;

  password: string;

  port?: number;

  user: string;
}

export interface IViewServerReply {
  created_at?: string;

  host: string;

  id?: number;

  name: string;

  password: string;

  port?: number;

  status?: ViewServerReplyStatusEnum;

  user: string;
}

export interface IViewUpdateServerRequest {
  id?: number;

  server?: IViewServer;
}

export interface IViewUserReply {
  role_id?: number;

  user_id?: number;

  username?: string;
}
