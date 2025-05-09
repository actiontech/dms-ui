import {
  IGetCustomDBPasswordRuleReply,
  ICustomDBPasswordRule,
  IUpdateCustomDBPasswordRuleReply
} from '../common.d';

export interface IAuthGetCustomDBPasswordRuleReturn
  extends IGetCustomDBPasswordRuleReply {}

export interface IAuthUpdateCustomDBPasswordRuleParams {
  update_custom_db_password_rule: ICustomDBPasswordRule;
}

export interface IAuthUpdateCustomDBPasswordRuleReturn
  extends IUpdateCustomDBPasswordRuleReply {}
