import {
  IAddSessionReq,
  IAddSessionReply,
  IDelSessionReply,
  IGetUserBySessionReply
} from '../common.d';

export interface IAddSessionParams extends IAddSessionReq {}

export interface IAddSessionReturn extends IAddSessionReply {}

export interface IDelSessionReturn extends IDelSessionReply {}

export interface IGetUserBySessionParams {
  user_uid?: string;
}

export interface IGetUserBySessionReturn extends IGetUserBySessionReply {}
