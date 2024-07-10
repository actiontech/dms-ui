import {
  IGetCompanyNoticeReply,
  IUpdateCompanyNoticeReq,
  IGenericResp
} from '../common.d';

export interface IGetCompanyNoticeReturn extends IGetCompanyNoticeReply {}

export interface IUpdateCompanyNoticeParams extends IUpdateCompanyNoticeReq {}

export interface IUpdateCompanyNoticeReturn extends IGenericResp {}
