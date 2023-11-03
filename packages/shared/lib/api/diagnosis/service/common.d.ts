import {
  ViewDatabaseReplyStatusEnum,
  ViewServerReplyStatusEnum
} from './common.enum';

export interface IDeleteDBsReq {
  db_monitor_names: string[];
}

export interface IDeleteServersReq {
  server_names?: string[];
}

export interface IGenericResp {
  code?: number;

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

export interface IListServersReply {
  code?: number;

  data?: IViewServerReply[];

  message?: string;

  total_nums?: number;
}

export interface ISaveDBsReq {
  dbs: IViewDatabase[];
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
