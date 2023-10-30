import {
  ViewDatabaseReplyStatusEnum,
  ViewServerStatusEnum,
  ViewServerReplyStatusEnum
} from './common.enum';

export interface IDeleteDBsReq {
  db_monitor_names: string[];

  project_uid: string;
}

export interface IDeleteServersReq {
  project_uid: string;

  serverNames?: string[];
}

export interface IGenericResp {
  code?: number;

  message?: string;
}

export interface IListDBsReply {
  code?: number;

  data?: IViewDatabaseReply[];

  message?: string;

  total?: number;
}

export interface IListServersReply {
  code?: number;

  data?: IViewServerReply[];

  message?: string;

  total?: number;
}

export interface ISaveDBsReq {
  dbs: IViewDatabase[];

  project_uid: string;
}

export interface ISaveServersReq {
  project_uid: string;

  servers: IViewServer[];
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
  createdAt?: string;

  datasource_name: string;

  datasource_uid: string;

  db_type: string;

  host: string;

  monitor_name: string;

  port: number;

  status?: ViewDatabaseReplyStatusEnum;
}

export interface IViewServer {
  createdAt?: string;

  host: string;

  name: string;

  password: string;

  port?: number;

  status?: ViewServerStatusEnum;

  user: string;
}

export interface IViewServerReply {
  createdAt?: string;

  host: string;

  name: string;

  password: string;

  port?: number;

  status?: ViewServerReplyStatusEnum;

  user: string;
}
