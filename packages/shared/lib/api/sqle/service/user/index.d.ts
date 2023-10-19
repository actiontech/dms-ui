import { IGetUserTipsResV1 } from '../common.d';

export interface IGetUserTipListV1Params {
  filter_project?: string;
}

export interface IGetUserTipListV1Return extends IGetUserTipsResV1 {}
