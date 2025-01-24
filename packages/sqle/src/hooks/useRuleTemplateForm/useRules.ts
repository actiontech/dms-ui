import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { useRequest } from 'ahooks';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useState, useCallback } from 'react';
import { useRuleFilterForm } from '../../components/RuleList';
import { cloneDeep } from 'lodash';
import useRuleVersionTips, {
  RuleVersionDictionaryEnum
} from '../useRuleVersionTips';

const useRules = (dbType: string, ruleVersion?: RuleVersionDictionaryEnum) => {
  const [activeRule, setActiveRule] = useState<IRuleResV1[]>([]);

  const [filteredRule, setFilteredRule] = useState<IRuleResV1[]>([]);

  const { form: ruleFilterForm, fuzzyKeyword, tags } = useRuleFilterForm();

  const { transformRuleVersion2BackendParams } = useRuleVersionTips();

  const { data: allRules, loading: getAllRulesLoading } = useRequest(
    () =>
      rule_template
        .getRuleListV1({
          filter_db_type: dbType,
          fuzzy_keyword_rule: fuzzyKeyword,
          tags,
          filter_rule_version: transformRuleVersion2BackendParams(ruleVersion)
        })
        .then((res) => res.data.data ?? []),
    {
      onSuccess: (res) => {
        const showRuleList = activeRule.filter((item) =>
          res.some((i) => i.rule_name === item.rule_name)
        );
        setFilteredRule(cloneDeep(showRuleList));
      },
      refreshDeps: [fuzzyKeyword, tags, dbType, ruleVersion],
      ready: !!dbType
    }
  );

  const clearSearchValue = useCallback(() => {
    ruleFilterForm.resetFields();
  }, [ruleFilterForm]);

  return {
    allRules,
    getAllRulesLoading,
    activeRule,
    setActiveRule,
    clearSearchValue,
    filteredRule,
    setFilteredRule,
    ruleFilterForm,
    filterCategoryTags: tags
  };
};

export default useRules;
