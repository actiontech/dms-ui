import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template/index';
import { IAuditResultItem } from '../../../../components/ReportDrawer/index.type';

export type AuditResultMap = Record<string, IAuditResult[]>;

export const useAuditResultMapRuleInfo = (
  auditResultMap?: AuditResultMap,
  dbType?: string
) => {
  const filterRuleNames = useMemo(() => {
    const allRuleNames = Object.values(auditResultMap ?? {})
      .flat()
      .map((v) => v.rule_name ?? '')
      .filter((v) => !!v);

    return [...new Set(allRuleNames)];
  }, [auditResultMap]);

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

  const auditResultRuleInfoMap = useMemo(() => {
    const result: Record<string, IAuditResultItem[]> = {};

    Object.entries(auditResultMap ?? {}).forEach(([key, auditResult]) => {
      result[key] =
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
        }) ?? [];
    });

    return result;
  }, [ruleInfo, auditResultMap, loading]);

  return {
    loading,
    auditResultRuleInfoMap
  };
};
