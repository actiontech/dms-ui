import { BasicSelectProps } from '@actiontech/shared';
import { SqleApi } from '@actiontech/shared/lib/api';
import { IGetDriverRuleVersionTipsV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
import { useCallback, useState } from 'react';

const useRuleVersionTips = () => {
  const [ruleVersionTips, setRuleVersionTips] = useState<
    IGetDriverRuleVersionTipsV1[]
  >([]);

  const {
    loading,
    run: updateRuleVersionTips,
    runAsync: updateRuleVersionTipsAsync
  } = useRequest(() => SqleApi.RuleTemplateService.GetDriverRuleVersionTips(), {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        setRuleVersionTips(res.data?.data ?? []);
      } else {
        setRuleVersionTips([]);
      }
    },
    onError: () => {
      setRuleVersionTips([]);
    }
  });

  const generateRuleVersionOptions: (
    dbType: string
  ) => BasicSelectProps['options'] = useCallback(
    (dbType) => {
      return ruleVersionTips
        .find((item) => item.db_type === dbType)
        ?.rule_versions?.map((item) => {
          return {
            label: `v${item}`,
            value: item
          };
        });
    },
    [ruleVersionTips]
  );

  return {
    loading,
    ruleVersionTips,
    updateRuleVersionTips,
    generateRuleVersionOptions,
    updateRuleVersionTipsAsync
  };
};

export default useRuleVersionTips;
