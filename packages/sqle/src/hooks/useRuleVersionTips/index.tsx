import { BasicSelectProps } from '@actiontech/shared';
import { useCallback } from 'react';

export enum RuleVersionDictionaryEnum {
  v1 = 'v1',
  v2 = 'v2'
}

const useRuleVersionTips = () => {
  //todo 临时处理方式
  const ruleVersionOptions: BasicSelectProps['options'] = Object.keys(
    RuleVersionDictionaryEnum
  ).map((key) => ({
    label: key,
    value:
      RuleVersionDictionaryEnum[key as keyof typeof RuleVersionDictionaryEnum]
  }));

  const transformRuleVersion2BackendParams = useCallback(
    (ruleVersion?: RuleVersionDictionaryEnum) => {
      if (ruleVersion === RuleVersionDictionaryEnum.v1) {
        return '';
      }
      return ruleVersion;
    },
    []
  );

  const transformBackendRuleVersion2FormValues = useCallback(
    (dbType: string, ruleVersion?: string) => {
      if (dbType === 'MySQL') {
        if (!ruleVersion) {
          return RuleVersionDictionaryEnum.v1;
        }

        return ruleVersion as RuleVersionDictionaryEnum;
      }
      return ruleVersion as RuleVersionDictionaryEnum;
    },
    []
  );

  return {
    ruleVersionOptions,
    transformRuleVersion2BackendParams,
    transformBackendRuleVersion2FormValues
  };
};

export default useRuleVersionTips;
