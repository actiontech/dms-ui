import { useCallback, useMemo } from 'react';
import { useRequest } from 'ahooks';
import {
  IAuditResult,
  ISkippedByRuleExceptionItem
} from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template/index';
import {
  collectAuditResultRuleNames,
  enrichAuditResultItemWithRuleInfo,
  enrichSkippedRuleExceptionItem
} from '../AuditResultMessage/auditResultDisplay';
import { IAuditResultItem } from './index.type';

const useAuditResultRuleInfo = (
  auditResult: IAuditResult[],
  dbType?: string,
  skippedByRuleException?: ISkippedByRuleExceptionItem[]
) => {
  const filterRuleNames = useMemo(
    () => collectAuditResultRuleNames(auditResult, skippedByRuleException),
    [auditResult, skippedByRuleException]
  );
  const filterRuleNamesKey = filterRuleNames.join(',');

  const { data: ruleInfo, loading } = useRequest(
    () =>
      rule_template
        .getRuleListV1({
          filter_rule_names: filterRuleNamesKey,
          filter_db_type: dbType
        })
        .then((res) => res.data.data),
    {
      ready: !!filterRuleNamesKey,
      refreshDeps: [filterRuleNamesKey, dbType]
    }
  );

  const ruleInfoFetched =
    filterRuleNames.length > 0 && !loading && ruleInfo !== undefined;

  const enrichAuditResultItem = useCallback(
    (item: IAuditResultItem) =>
      enrichAuditResultItemWithRuleInfo(item, ruleInfo, {
        loading,
        ruleInfoFetched
      }),
    [loading, ruleInfo, ruleInfoFetched]
  );

  const enrichSkippedItem = useCallback(
    (item: ISkippedByRuleExceptionItem) =>
      enrichSkippedRuleExceptionItem(item, ruleInfo, {
        loading,
        ruleInfoFetched,
        fallbackDbType: dbType
      }),
    [dbType, loading, ruleInfo, ruleInfoFetched]
  );

  const auditResultRuleInfo = useMemo(() => {
    return auditResult?.map((item) => enrichAuditResultItem(item)) ?? [];
  }, [auditResult, enrichAuditResultItem]);

  return {
    ruleInfo,
    loading,
    auditResultRuleInfo,
    enrichAuditResultItem,
    enrichSkippedItem
  };
};

export default useAuditResultRuleInfo;
