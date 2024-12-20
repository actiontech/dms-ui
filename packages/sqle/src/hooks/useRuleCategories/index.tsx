import ruleTemplate from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ReactNode, useMemo } from 'react';
import { RuleCategoryDictionaryGroup, DictionaryType } from './index.data';
import { Typography } from 'antd';
import { RuleCategoryOptionStyleWrapper } from './style';

const useRuleCategories = (showOptionCount = false) => {
  const { data: ruleCategories, loading: getRuleCategoriesLoading } =
    useRequest(() =>
      ruleTemplate.getCategoryStatistics().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
      })
    );

  const {
    auditAccuracyOptions,
    operandOptions,
    sqlOptions,
    auditPurposeOptions
  } = useMemo(() => {
    const renderOptionLabel = (
      dictionary: DictionaryType,
      tag: string,
      count: number
    ): ReactNode => {
      if (showOptionCount) {
        return (
          <RuleCategoryOptionStyleWrapper>
            {dictionary[tag]}{' '}
            <Typography.Text type="secondary">{count}</Typography.Text>
          </RuleCategoryOptionStyleWrapper>
        );
      }
      return dictionary[tag];
    };

    const optionGroup: {
      [key: string]:
        | Array<{ label: ReactNode; value: string; text: string }>
        | undefined;
    } = {};
    Object.keys(ruleCategories ?? {}).forEach((key) => {
      const dictionary = RuleCategoryDictionaryGroup[key];
      optionGroup[key] = ruleCategories?.[key]?.map((i) => ({
        label: renderOptionLabel(dictionary, i.tag ?? '', i.count ?? 0),
        value: i.tag ?? '',
        text: dictionary[i.tag ?? '']
      }));
    });
    return {
      auditAccuracyOptions: optionGroup.audit_accuracy,
      operandOptions: optionGroup.operand,
      sqlOptions: optionGroup.sql,
      auditPurposeOptions: optionGroup.audit_purpose
    };
  }, [ruleCategories, showOptionCount]);

  return {
    ruleCategories,
    getRuleCategoriesLoading,
    auditAccuracyOptions,
    operandOptions,
    sqlOptions,
    auditPurposeOptions
  };
};

export default useRuleCategories;
