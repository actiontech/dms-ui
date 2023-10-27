export interface IDeleteServersReq {
  project_uid: string;

  serverNames?: string[];
}

export interface IGenericResp {
  code?: number;

  message?: string;
}

export interface IListServersReply {
  code?: number;

  data?: IViewServer[];

  message?: string;

  total?: number;
}

export interface ISaveServersReq {
  project_uid: string;

  servers: IViewServer[];
}

export interface IViewServer {
  host: string;

  name: string;

  password: string;

  port?: number;

  user: string;
}
