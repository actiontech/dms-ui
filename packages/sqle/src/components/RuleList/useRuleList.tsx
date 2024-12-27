import { useCallback, useState } from 'react';
import { RuleStatusEnum } from './index.type';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const useRuleList = () => {
  const [ruleStatus, setRuleStatus] = useState<RuleStatusEnum>(
    RuleStatusEnum.enabled
  );

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

  return {
    ruleStatus,
    setRuleStatus,
    getCurrentStatusRules
  };
};

export default useRuleList;
