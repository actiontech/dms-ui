import { AuthListPasswordSecurityPolicysOrderByEnum } from './index.enum';

import {
  IListPasswordSecurityPolicysReply,
  IAddPasswordSecurityPolicy,
  IAddPasswordSecurityPolicyReply,
  IUpdatePasswordSecurityPolicy,
  IGenericResp
} from '../common.d';

export interface IAuthListPasswordSecurityPolicysParams {
  project_uid: string;

  page_size: number;

  page_index?: number;

  order_by?: AuthListPasswordSecurityPolicysOrderByEnum;

  keyword?: string;
}

export interface IAuthListPasswordSecurityPolicysReturn
  extends IListPasswordSecurityPolicysReply {}

export interface IAuthAddPasswordSecurityPolicyParams {
  project_uid: string;

  password_security_policy?: IAddPasswordSecurityPolicy;
}

export interface IAuthAddPasswordSecurityPolicyReturn
  extends IAddPasswordSecurityPolicyReply {}

export interface IAuthUpdatePasswordSecurityPolicyParams {
  project_uid: string;

  uid: string;

  password_security_policy?: IUpdatePasswordSecurityPolicy;
}

export interface IAuthUpdatePasswordSecurityPolicyReturn extends IGenericResp {}

export interface IAuthDelPasswordSecurityPolicyParams {
  project_uid: string;

  uid: string;
}

export interface IAuthDelPasswordSecurityPolicyReturn extends IGenericResp {}
