import {
  IAddSessionReq,
  IAddSessionReply,
  IGenericResp,
  IGetUserBySessionReply
} from '../common.d';

export interface IAddSessionParams extends IAddSessionReq {}

export interface IAddSessionReturn extends IAddSessionReply {}

export interface IDelSessionReturn extends IGenericResp {}

export interface IGetUserBySessionParams {
  user_uid?: string;
}

export interface IGetUserBySessionReturn extends IGetUserBySessionReply {}
