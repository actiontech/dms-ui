import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { useRequest } from 'ahooks';
import { IGetRuleListV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useState, useCallback, useEffect } from 'react';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';

const useRules = (manual = false) => {
  const [activeRule, setActiveRule] = useState<IRuleResV1[]>([]);

  const [databaseRule, setDatabaseRule] = useState<IRuleResV1[]>([]);

  const [filteredRule, setFilteredRule] = useState<IRuleResV1[]>([]);

  const [dbType, setDbType] = useState<string>('');

  const {
    data: allRules,
    loading: getAllRulesLoading,
    run: getAllRules,
    runAsync: getAllRulesAsync
  } = useRequest(
    (params: IGetRuleListV1Params) =>
      rule_template
        .getRuleListV1(params ?? {})
        .then((res) => res.data.data ?? []),
    {
      manual
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
    EventEmitter.emit(EmitterKey.Search_Rule_Template_Rule_Clear_Value);
  }, []);

  useEffect(() => {
    if (!manual) {
      const { unsubscribe } = EventEmitter.subscribe(
        EmitterKey.Search_Rule_Template_Rule_Select_List,
        (value) => {
          getAllRules({
            fuzzy_keyword_rule: value
          });
        }
      );
      return unsubscribe;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    allRules,
    getAllRulesLoading,
    getAllRules,
    getAllRulesAsync,
    activeRule,
    setActiveRule,
    databaseRule,
    setDatabaseRule,
    dbType,
    setDbType,
    subscribe,
    clearSearchValue,
    filteredRule,
    setFilteredRule
  };
};

export default useRules;
