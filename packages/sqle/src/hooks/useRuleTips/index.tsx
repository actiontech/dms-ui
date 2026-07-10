import React, { useMemo } from 'react';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IRuleTips } from '@actiontech/shared/lib/api/sqle/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';

export const DB_TYPE_RULE_NAME_SEPARATOR = '_DB_TYPE_RULE_NAME_SEPARATOR_';

export const splitRuleTipSelectValue = (value: string) => {
  const separatorIndex = value.indexOf(DB_TYPE_RULE_NAME_SEPARATOR);
  if (separatorIndex === -1) {
    return value;
  }
  return value.slice(separatorIndex + DB_TYPE_RULE_NAME_SEPARATOR.length);
};

export const extractDbTypeFromRuleSelectValue = (
  value: string
): string | undefined => {
  const separatorIndex = value.indexOf(DB_TYPE_RULE_NAME_SEPARATOR);
  if (separatorIndex === -1) {
    return undefined;
  }
  const dbType = value.slice(0, separatorIndex);
  return dbType || undefined;
};

type RuleTipsStore = {
  data: Map<string, IRuleTips[]>;
  inflight: Map<string, Promise<IRuleTips[]>>;
  listeners: Set<() => void>;
};

const ruleTipsStore: RuleTipsStore = {
  data: new Map(),
  inflight: new Map(),
  listeners: new Set()
};

const notifyRuleTipsListeners = () => {
  ruleTipsStore.listeners.forEach((listener) => listener());
};

export const resetRuleTipsCacheForTests = () => {
  ruleTipsStore.data.clear();
  ruleTipsStore.inflight.clear();
};

const fetchRuleTips = (projectName: string): Promise<IRuleTips[]> => {
  if (ruleTipsStore.data.has(projectName)) {
    return Promise.resolve(ruleTipsStore.data.get(projectName)!);
  }

  const inflightRequest = ruleTipsStore.inflight.get(projectName);
  if (inflightRequest) {
    return inflightRequest;
  }

  const request = SqlManage.GetSqlManageRuleTips({
    project_name: projectName
  })
    .then((res) => {
      const data =
        res.data.code === ResponseCode.SUCCESS ? res.data?.data ?? [] : [];
      ruleTipsStore.data.set(projectName, data);
      return data;
    })
    .catch(() => {
      ruleTipsStore.data.set(projectName, []);
      return [] as IRuleTips[];
    })
    .finally(() => {
      ruleTipsStore.inflight.delete(projectName);
      notifyRuleTipsListeners();
    });

  ruleTipsStore.inflight.set(projectName, request);
  notifyRuleTipsListeners();
  return request;
};

const useRuleTips = () => {
  const [subscribedProjectName, setSubscribedProjectName] = React.useState<
    string | undefined
  >();
  const [, forceUpdate] = React.useReducer((value: number) => value + 1, 0);
  const { getLogoUrlByDbType } = useDbServiceDriver();

  React.useEffect(() => {
    const listener = () => forceUpdate();
    ruleTipsStore.listeners.add(listener);
    return () => {
      ruleTipsStore.listeners.delete(listener);
    };
  }, []);

  const updateRuleTips = React.useCallback((projectName: string) => {
    setSubscribedProjectName(projectName);
    void fetchRuleTips(projectName);
  }, []);

  const ruleTips = subscribedProjectName
    ? ruleTipsStore.data.get(subscribedProjectName) ?? []
    : [];
  const loading = subscribedProjectName
    ? ruleTipsStore.inflight.has(subscribedProjectName)
    : false;

  const generateRuleTipsSelectOptions = useMemo(() => {
    return ruleTips.map((value) => {
      return {
        label: (
          <DatabaseTypeLogo
            dbType={value.db_type ?? ''}
            logoUrl={getLogoUrlByDbType(value.db_type ?? '')}
          />
        ),
        options: (value?.rule ?? []).map((rule) => {
          return {
            label: rule.desc,
            value: `${value.db_type}${DB_TYPE_RULE_NAME_SEPARATOR}${rule.rule_name}`
          };
        })
      };
    });
  }, [ruleTips, getLogoUrlByDbType]);

  const ruleNameDescMap = useMemo(() => {
    const map = new Map<string, string>();
    ruleTips.forEach((group) => {
      group.rule?.forEach((rule) => {
        if (rule.rule_name) {
          map.set(rule.rule_name, rule.desc ?? rule.rule_name);
        }
      });
    });
    return map;
  }, [ruleTips]);

  const mapRuleNamesToSelectValues = React.useCallback(
    (ruleNames: string[]) => {
      const values: string[] = [];
      ruleTips.forEach((group) => {
        group.rule?.forEach((rule) => {
          if (rule.rule_name && ruleNames.includes(rule.rule_name)) {
            values.push(
              `${group.db_type ?? ''}${DB_TYPE_RULE_NAME_SEPARATOR}${
                rule.rule_name
              }`
            );
          }
        });
      });
      return values;
    },
    [ruleTips]
  );

  const generateFlatRuleOptionsByDbType = React.useCallback(
    (dbType?: string) => {
      if (!dbType) {
        return [];
      }
      const group = ruleTips.find((item) => item.db_type === dbType);
      return (group?.rule ?? []).map((rule) => ({
        label: rule.desc,
        value: `${dbType}${DB_TYPE_RULE_NAME_SEPARATOR}${rule.rule_name}`
      }));
    },
    [ruleTips]
  );

  const dbTypeOptions = useMemo(() => {
    const dbTypes = new Set<string>();
    ruleTips.forEach((group) => {
      if (group.db_type) {
        dbTypes.add(group.db_type);
      }
    });
    return [...dbTypes].map((dbType) => ({
      label: dbType,
      value: dbType
    }));
  }, [ruleTips]);

  return {
    ruleTips,
    loading,
    updateRuleTips,
    generateRuleTipsSelectOptions,
    generateFlatRuleOptionsByDbType,
    dbTypeOptions,
    ruleNameDescMap,
    mapRuleNamesToSelectValues
  };
};

export default useRuleTips;
