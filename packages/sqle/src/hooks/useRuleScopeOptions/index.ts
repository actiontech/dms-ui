import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  IRuleResV1,
  IRuleScopeDisplayV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { DB_TYPE_RULE_NAME_SEPARATOR } from '../useRuleTips';

export const buildRuleSelectValue = (dbType: string, ruleName: string) =>
  `${dbType}${DB_TYPE_RULE_NAME_SEPARATOR}${ruleName}`;

export const buildFlatRuleOptionsFromRules = (
  rules: IRuleResV1[],
  dbType: string
): Array<{ label: string; value: string }> =>
  rules
    .filter((rule) => rule.rule_name?.trim())
    .map((rule) => ({
      label: rule.desc?.trim() || rule.rule_name?.trim() || '',
      value: buildRuleSelectValue(dbType, rule.rule_name!.trim())
    }));

export const mergeRulesWithSavedDisplay = (
  rules: IRuleResV1[],
  savedRuleScopeDisplay?: IRuleScopeDisplayV1[],
  dbType?: string
): IRuleResV1[] => {
  const seen = new Set(
    rules
      .map((rule) => rule.rule_name?.trim())
      .filter((ruleName): ruleName is string => !!ruleName)
  );
  const merged = [...rules];

  savedRuleScopeDisplay?.forEach((item) => {
    const ruleName = item.rule_name?.trim();
    if (!ruleName || seen.has(ruleName)) {
      return;
    }
    seen.add(ruleName);
    merged.push({
      rule_name: ruleName,
      desc: item.rule_desc?.trim() || ruleName,
      db_type: item.db_type?.trim() || dbType
    });
  });

  return merged;
};

const useRuleScopeOptions = (dbType?: string) => {
  const [keyword, setKeyword] = useState('');

  const {
    data: rules = [],
    loading,
    error,
    run,
    refresh: reload
  } = useRequest(
    (params: { filter_db_type: string; fuzzy_keyword_rule?: string }) =>
      rule_template.getRuleListV1(params).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data ?? [];
        }
        throw new Error(res.data.message);
      }),
    {
      manual: true,
      debounceWait: 300
    }
  );

  const trimmedDbType = dbType?.trim();

  useEffect(() => {
    if (!trimmedDbType) {
      return;
    }
    run({
      filter_db_type: trimmedDbType,
      fuzzy_keyword_rule: keyword.trim() || undefined
    });
  }, [keyword, run, trimmedDbType]);

  useEffect(() => {
    setKeyword('');
  }, [trimmedDbType]);

  const searchRules = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  const ruleNameDescMap = useMemo(() => {
    const map = new Map<string, string>();
    rules.forEach((rule) => {
      const ruleName = rule.rule_name?.trim();
      if (ruleName) {
        map.set(ruleName, rule.desc?.trim() || ruleName);
      }
    });
    return map;
  }, [rules]);

  const generateFlatRuleOptionsByDbType = useCallback(
    (
      targetDbType?: string,
      savedRuleScopeDisplay?: IRuleScopeDisplayV1[]
    ): Array<{ label: string; value: string }> => {
      const type = targetDbType?.trim();
      if (!type || type !== trimmedDbType) {
        return [];
      }
      const mergedRules = mergeRulesWithSavedDisplay(
        rules,
        savedRuleScopeDisplay,
        type
      );
      return buildFlatRuleOptionsFromRules(mergedRules, type);
    },
    [rules, trimmedDbType]
  );

  return {
    rules,
    loading,
    error,
    reload,
    searchRules,
    ruleNameDescMap,
    generateFlatRuleOptionsByDbType
  };
};

export default useRuleScopeOptions;
