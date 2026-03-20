import {
  IGetCompanyNoticeReply,
  IUpdateCompanyNoticeReq,
  IGenericResp
} from '../common.d';

export interface IGetCompanyNoticeParams {
  include_latest_outside_period?: boolean;
}

export interface IGetCompanyNoticeReturn extends IGetCompanyNoticeReply {}

export interface IUpdateCompanyNoticeParams extends IUpdateCompanyNoticeReq {}

export interface IUpdateCompanyNoticeReturn extends IGenericResp {}
