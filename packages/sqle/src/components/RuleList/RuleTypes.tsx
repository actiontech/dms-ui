import { useEffect, useRef } from 'react';
import { RuleTypesProps } from './index.type';
import { RuleTypeItemStyleWrapper, RuleTypeStyleWrapper } from './style';
import useRuleType from '../../hooks/useRuleType';
import { useControllableValue } from 'ahooks';
import { isEqual } from 'lodash';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export const ALL_RULE_TYPE_CONSTANT = 'ALL';

const RuleTypes: React.FC<RuleTypesProps> = ({
  currentRuleType,
  ruleTypeChange,
  allRulesData,
  rules = []
}) => {
  const allRulesDataRef = useRef<IRuleResV1[]>();
  const rulesRef = useRef<IRuleResV1[]>();

  const { getRuleTypeDataSource, ruleTypeData } = useRuleType();

  const [internalRuleType, setInternalRuleType] = useControllableValue<string>(
    typeof currentRuleType !== undefined && ruleTypeChange
      ? {
          value: currentRuleType,
          onChange: ruleTypeChange,
          defaultValue: ALL_RULE_TYPE_CONSTANT
        }
      : {
          defaultValue: ALL_RULE_TYPE_CONSTANT
        }
  );

  useEffect(() => {
    if (!isEqual(allRulesDataRef, allRulesData) || !isEqual(rulesRef, rules)) {
      allRulesDataRef.current = allRulesData;
      allRulesDataRef.current = rules;
      getRuleTypeDataSource(allRulesData, rules);
    }
  }, [allRulesData, rules, getRuleTypeDataSource]);

  return (
    <RuleTypeStyleWrapper>
      <RuleTypeItemStyleWrapper
        onClick={() => {
          setInternalRuleType(ALL_RULE_TYPE_CONSTANT);
          ruleTypeChange?.(ALL_RULE_TYPE_CONSTANT);
        }}
        active={internalRuleType === ALL_RULE_TYPE_CONSTANT}
      >
        {ALL_RULE_TYPE_CONSTANT}
        <span className="number-wrapper">{rules.length}</span>
      </RuleTypeItemStyleWrapper>
      {ruleTypeData.map((v) => (
        <RuleTypeItemStyleWrapper
          key={v.rule_type}
          onClick={() => {
            setInternalRuleType(v.rule_type ?? '');
            ruleTypeChange?.(v.rule_type ?? '');
          }}
          active={v.rule_type === internalRuleType}
        >
          {v.rule_type}
          <span className="number-wrapper">{v.len ?? 0}</span>
        </RuleTypeItemStyleWrapper>
      ))}
    </RuleTypeStyleWrapper>
  );
};

export default RuleTypes;
