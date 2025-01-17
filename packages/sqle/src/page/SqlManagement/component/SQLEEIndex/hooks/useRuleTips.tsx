import { useBoolean } from 'ahooks';
import React, { useMemo } from 'react';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IRuleTips } from '@actiontech/shared/lib/api/sqle/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';

export const DB_TYPE_RULE_NAME_SEPARATOR = '_DB_TYPE_RULE_NAME_SEPARATOR_';

const useRuleTips = () => {
  const [ruleTips, setRuleTips] = React.useState<IRuleTips[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const { getLogoUrlByDbType } = useDbServiceDriver();

  const updateRuleTips = React.useCallback(
    (projectName: string) => {
      setTrue();
      SqlManage.GetSqlManageRuleTips({
        project_name: projectName
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setRuleTips(res.data?.data ?? []);
          } else {
            setRuleTips([]);
          }
        })
        .catch(() => {
          setRuleTips([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

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

  return {
    ruleTips,
    loading,
    updateRuleTips,
    generateRuleTipsSelectOptions
  };
};

export default useRuleTips;
