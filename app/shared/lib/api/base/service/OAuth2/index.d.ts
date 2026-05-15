import {
  IGetOauth2TipsReply,
  IBindOauth2UserReq,
  IBindOauth2UserReply
} from '../common.d';

export interface IGetOauth2TipsReturn extends IGetOauth2TipsReply {}

export interface IBindOauth2UserParams extends IBindOauth2UserReq {}

export interface IBindOauth2UserReturn extends IBindOauth2UserReply {}
