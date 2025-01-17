import { IGetDBAccountMetaReply } from '../common.d';

export interface IAuthGetDBAccountMetaParams {
  project_uid: string;

  service_uid: string;

  db_type?: string;
}

export interface IAuthGetDBAccountMetaReturn extends IGetDBAccountMetaReply {}
