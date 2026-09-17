import {
  IRuleReqV1,
  IRuleResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { resolveRuleConfigErrorPriority } from '../../../components/AuditResultMessage/errorPriorityDisplay';

/** 模板保存：非 error 不带 priority，避免后端 400 */
export const mapActiveRuleToRuleReq = (rule: IRuleResV1): IRuleReqV1 => {
  const isError = rule.level === RuleResV1LevelEnum.error;
  const req: IRuleReqV1 = {
    name: rule.rule_name,
    level: rule.level,
    params: rule.params
      ? rule.params.map((v) => ({ key: v.key, value: v.value }))
      : [],
    is_custom_rule: !!rule.is_custom_rule
  };
  if (isError) {
    req.error_priority = resolveRuleConfigErrorPriority(
      rule.level,
      rule.error_priority
    );
  }
  return req;
};
