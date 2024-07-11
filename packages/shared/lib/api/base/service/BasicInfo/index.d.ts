import { IGetBasicInfoReply, IGenericResp } from '../common.d';

export interface IGetBasicInfoReturn extends IGetBasicInfoReply {}

export interface IPersonalizationParams {
  title?: string;

  file?: any;
}

export interface IPersonalizationReturn extends IGenericResp {}
