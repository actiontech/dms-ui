import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { useRequest } from 'ahooks';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useState, useCallback } from 'react';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { useRuleFilterForm } from '../../components/RuleList';
import { IGetRuleListV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';

type useRulesOptionsType = {
  manual?: boolean;
  onSuccess?: (data: IRuleResV1[]) => void;
  dbType?: string;
};

const useRules = (
  dbType: string,
  manual = false,
  onSuccess?: (data: IRuleResV1[]) => void
) => {
  // 当前选中的Rule 也就是最终会传递给接口的rule
  const [activeRule, setActiveRule] = useState<IRuleResV1[]>([]);

  // 当前数据库类型的rule
  const [databaseRule, setDatabaseRule] = useState<IRuleResV1[]>([]);

  // 当前筛选出的rule 也就是页面页面中展示出来的rule
  const [filteredRule, setFilteredRule] = useState<IRuleResV1[]>([]);

  const { form: ruleFilterForm, fuzzyKeyword, tags } = useRuleFilterForm();

  // const [dbType, setDbType] = useState<string>('');

  // console.log('dbType11111--->', dbType);

  const {
    data: allRules,
    loading: getAllRulesLoading,
    run: getAllRules,
    runAsync: getAllRulesAsync
  } = useRequest(
    (params: IGetRuleListV1Params) =>
      rule_template
        .getRuleListV1({
          filter_db_type: dbType,
          fuzzy_keyword_rule: fuzzyKeyword,
          tags
        })
        .then((res) => res.data.data ?? []),
    {
      manual,
      onSuccess,
      refreshDeps: [fuzzyKeyword, tags, dbType]
    }
  );

  const subscribe = useCallback((callBack: (value: string) => void) => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Search_Rule_Template_Rule_Select_List,
      callBack
    );
    return unsubscribe;
  }, []);

  const clearSearchValue = useCallback(() => {
    ruleFilterForm.resetFields();
  }, [ruleFilterForm]);

  return {
    allRules,
    getAllRulesLoading,
    getAllRules,
    getAllRulesAsync,
    activeRule,
    setActiveRule,
    databaseRule,
    setDatabaseRule,
    // dbType,
    // setDbType,
    subscribe,
    clearSearchValue,
    filteredRule,
    setFilteredRule,
    ruleFilterForm
  };
};

export default useRules;
