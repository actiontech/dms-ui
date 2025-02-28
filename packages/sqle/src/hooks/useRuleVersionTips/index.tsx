import { BasicSelectProps } from '@actiontech/shared';
import { RuleTemplateService } from '@actiontech/shared/lib/api';
import { IGetDriverRuleVersionTipsV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';

const useRuleVersionTips = () => {
  const [loading, { setTrue, setFalse }] = useBoolean();

  const [ruleVersionTips, setRuleVersionTips] = useState<
    IGetDriverRuleVersionTipsV1[]
  >([]);

  const updateRuleVersionTips = useCallback(() => {
    setTrue();
    RuleTemplateService.GetDriverRuleVersionTips()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setRuleVersionTips(res.data?.data ?? []);
        } else {
          setRuleVersionTips([]);
        }
      })
      .catch(() => {
        setRuleVersionTips([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

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
    generateRuleVersionOptions
  };
};

export default useRuleVersionTips;
