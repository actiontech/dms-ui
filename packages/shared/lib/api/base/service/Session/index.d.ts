import {
  IAddSessionReq,
  IAddSessionReply,
  IDelSessionReply,
  IGetUserBySessionReply
} from '../common.d';

export interface IAddSessionParams extends IAddSessionReq {}

export interface IAddSessionReturn extends IAddSessionReply {}

export interface IDelSessionReturn extends IDelSessionReply {}

export interface IRefreshSessionReturn extends IAddSessionReply {}

export interface IGetUserBySessionParams {
  user_uid?: string;
}

export interface IGetUserBySessionReturn extends IGetUserBySessionReply {}
