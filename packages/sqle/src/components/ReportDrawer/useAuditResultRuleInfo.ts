import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template/index';

const useAuditResultRuleInfo = (
  auditResult: IAuditResult[],
  dbType?: string,
  apiReady = true
) => {
  const filterRuleNames = useMemo(
    () => (auditResult?.map((v) => v.rule_name ?? '') ?? []).filter((v) => !!v),
    [auditResult]
  );

  const { data: ruleInfo, loading } = useRequest(
    () =>
      rule_template
        .getRuleListV1({
          filter_rule_names: filterRuleNames.join(','),
          filter_db_type: dbType
        })
        .then((res) => res.data.data),
    {
      ready: !!filterRuleNames.length && apiReady,
      refreshDeps: [filterRuleNames]
    }
  );

  const auditResultRuleInfo = useMemo(() => {
    return (
      auditResult?.map((item) => {
        const findData =
          ruleInfo?.find((i) => i.rule_name === item.rule_name) ?? {};
        return {
          ...findData,
          ...item,
          isRuleDeleted:
            item.rule_name && !loading
              ? JSON.stringify(findData) === '{}'
              : false
        };
      }) ?? []
    );
  }, [ruleInfo, auditResult, loading]);

  return { ruleInfo, loading, auditResultRuleInfo };
};

export default useAuditResultRuleInfo;
