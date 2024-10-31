import { useCallback, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Select, Space } from 'antd';
import { ResponseCode } from '../../data/common';
import {
  IRuleResV1,
  IRuleTypeV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';

export interface IRuleTypeItem {
  rule_type: string;
  len: number;
}

const useRuleType = () => {
  const [ruleTypeList, setRuleTypeList] = useState<IRuleTypeV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const [ruleTypeData, setRuleTypeData] = useState<IRuleTypeItem[]>([]);

  const updateRuleTypeList = useCallback(
    (dbType: string) => {
      setTrue();
      rule_template
        .getRuleTypeByDBTypeV1({
          db_type: dbType
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setRuleTypeList(res.data?.data ?? []);
          } else {
            setRuleTypeList([]);
          }
        })
        .catch(() => {
          setRuleTypeList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const getRuleTypeDataSource = useCallback(
    (allRules: IRuleResV1[], rules: IRuleResV1[]) => {
      const map = new Map<string, IRuleTypeItem>();
      if (allRules) {
        allRules.forEach((rule) => {
          if (rule.type) {
            map.set(rule.type, { rule_type: rule.type, len: 0 });
          }
        });
      }
      if (rules?.length) {
        rules.forEach((rule) => {
          if (!rule.type) {
            return;
          }
          if (map.has(rule.type)) {
            const currentRuleItem = map.get(rule.type);
            if (currentRuleItem) {
              map.set(rule.type, {
                ...currentRuleItem,
                len: (currentRuleItem.len ?? 0) + 1
              });
            }
          } else {
            map.set(rule.type, {
              rule_type: rule.type,
              len: 1
            });
          }
        });
      }
      setRuleTypeData(Array.from(map.values()));
    },
    []
  );

  const generateRuleTypeSelectOption = useCallback(() => {
    return ruleTypeList.map((v) => {
      return (
        <Select.Option key={v.rule_type} value={v.rule_type ?? ''}>
          <Space size={6}>
            <span>{v.rule_type}</span>
            <span>{v.rule_count ? `(${v.rule_count})` : ''}</span>
          </Space>
        </Select.Option>
      );
    });
  }, [ruleTypeList]);

  return {
    ruleTypeList,
    loading,
    updateRuleTypeList,
    generateRuleTypeSelectOption,
    ruleTypeData,
    getRuleTypeDataSource
  };
};

export default useRuleType;
