import {
  ViewDatabaseReplyStatusEnum,
  ViewServerReplyStatusEnum
} from './common.enum';

export interface IGenericResp {
  code?: number;

  message?: string;
}

export interface IDeleteDBsReq {
  db_monitor_ids: string[];
}

export interface IDeleteServersReq {
  server_ids?: string[];
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

export interface IListMonitorMetricsReply {
  code?: number;

  data?: IMonitorMetrics;

  message?: string;

  total_nums?: number;
}

export interface IListMonitorRoutinesReply {
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

export interface IMonitorMetrics {
  metrics?: Array<{
    desc?: string;

    metric_key?: string;
  }>;

  monitor_id?: number;
}

export interface IRoleCreateRequest {
  role_desc?: string;

  role_name?: string;

  scopes?: string[];
}

export interface IRoleDeleteRequest {
  role_id?: string;
}

export interface IRoleScopeCreateRequest {
  role_id?: string;

  scope_name?: string;
}

export interface IRoleScopeDeleteRequest {
  role_id?: string;

  scope_names?: string[];
}

export interface IRoleUpdateRequest {
  role_desc?: string;

  role_id?: string;

  scopes?: string[];
}

export interface ISaveDBsReq {
  dbs: IViewDatabase[];
}

export interface IUserCreateRequest {
  password?: string;

  role_id?: string;

  username?: string;
}

export interface IUserDeleteRequest {
  user_id?: string;
}

export interface IUserLoginReply {
  code?: number;

  message?: string;

  token?: string;

  user_id?: string;
}

export interface IUserLoginRequest {
  password?: string;

  username?: string;
}

export interface IUserUpdatePasswordRequest {
  password?: string;

  user_id?: string;
}

export interface IUserUpdateRequest {
  password?: string;

  role_id?: string;

  user_id?: string;
}

export interface IViewAddServerRequest {
  servers?: IViewServer[];
}

export interface IViewDatabase {
  host: string;

  monitor_name: string;

  monitor_type: string;

  password: string;

  port: number;

  username: string;
}

export interface IViewDatabaseReply {
  created_at?: string;

  host: string;

  id?: string;

  monitor_name: string;

  monitor_type: string;

  port: number;

  status?: ViewDatabaseReplyStatusEnum;

  username: string;
}

export interface IViewMonitorConfigReply {
  desc?: string;

  enable?: boolean;

  id?: string;

  interval?: number;

  monitor_id?: number;

  monitor_name?: string;

  via?: string;
}

export interface IViewRoleReply {
  id?: string;

  role_desc?: string;

  role_name?: string;

  scopes?: string[];
}

export interface IViewScope {
  group?: string;

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

  host?: string;

  id?: string;

  name?: string;

  port?: number;

  status?: ViewServerReplyStatusEnum;

  user?: string;
}

export interface IViewUpdateDBRequest {
  id?: string;

  password: string;

  username: string;
}

export interface IViewUpdateServerRequest {
  id?: string;

  server?: IViewServer;
}

export interface IViewUserReply {
  role_id?: string;

  role_name?: string;

  user_id?: string;

  username?: string;
}
