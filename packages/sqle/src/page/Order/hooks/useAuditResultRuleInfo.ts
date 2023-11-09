import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template/index';

const useAuditResultRuleInfo = (
  auditResult: IAuditResult[],
  dbType: string
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
      ready: !!filterRuleNames.length,
      refreshDeps: [filterRuleNames]
    }
  );

  return { ruleInfo, loading };
};

export default useAuditResultRuleInfo;
