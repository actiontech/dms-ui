import {
  ISendSmsCodeReq,
  ISendSmsCodeReply,
  IVerifySmsCodeReq,
  IVerifySmsCodeReply
} from '../common.d';

export interface ISendSmsCodeParams extends ISendSmsCodeReq {}

export interface ISendSmsCodeReturn extends ISendSmsCodeReply {}

export interface IVerifySmsCodeParams extends IVerifySmsCodeReq {}

export interface IVerifySmsCodeReturn extends IVerifySmsCodeReply {}
