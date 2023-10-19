import { useCallback, useState } from 'react';
import { RuleStatusEnum } from './index.type';
import { ALL_RULE_TYPE_CONSTANT } from './RuleTypes';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const useRuleList = () => {
  const [ruleStatus, setRuleStatus] = useState<RuleStatusEnum>(
    RuleStatusEnum.enabled
  );
  const [ruleType, setRuleType] = useState<string>(ALL_RULE_TYPE_CONSTANT);

  const getDisableRules = useCallback(
    (allRules?: IRuleResV1[], activeRules?: IRuleResV1[]) => {
      if (!activeRules) {
        return allRules ?? [];
      }

      return (
        allRules?.filter(
          (e) => !activeRules.find((item) => item.rule_name === e.rule_name)
        ) ?? []
      );
    },
    []
  );

  const getCurrentStatusRules = useCallback(
    (
      allRules?: IRuleResV1[],
      activeRules?: IRuleResV1[],
      ruleTemplateName?: string
    ) => {
      if (!ruleTemplateName) {
        return allRules ?? [];
      }
      if (ruleStatus === RuleStatusEnum.disabled) {
        return getDisableRules(allRules, activeRules);
      }
      return activeRules ?? [];
    },
    [getDisableRules, ruleStatus]
  );

  const getCurrentTypeRules = useCallback(
    (
      allRules?: IRuleResV1[],
      activeRules?: IRuleResV1[],
      ruleTemplateName?: string
    ) => {
      return getCurrentStatusRules(
        allRules,
        activeRules,
        ruleTemplateName
      ).filter((v) => {
        if (ruleType === ALL_RULE_TYPE_CONSTANT) {
          return true;
        }

        return v.type === ruleType;
      });
    },
    [getCurrentStatusRules, ruleType]
  );

  return {
    ruleStatus,
    setRuleStatus,
    ruleType,
    setRuleType,
    getCurrentStatusRules,
    getCurrentTypeRules
  };
};

export default useRuleList;
