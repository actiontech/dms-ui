import { useEffect, useState } from 'react';
import { RuleTypesProps } from './index.type';
import { RuleTypeItemStyleWrapper, RuleTypeStyleWrapper } from './style';
import useRuleType from '../../hooks/useRuleType';

export const ALL_RULE_TYPE_CONSTANT = 'ALL';

const RuleTypes: React.FC<RuleTypesProps> = ({
  currentRuleType,
  ruleTypeChange,
  allRulesData,
  rules = []
}) => {
  const { getRuleTypeDataSource, ruleTypeData } = useRuleType();

  const [internalRuleType, setInternalRuleType] = useState<string>(
    currentRuleType ?? ALL_RULE_TYPE_CONSTANT
  );

  useEffect(() => {
    getRuleTypeDataSource(allRulesData, rules);
  }, [allRulesData, rules, getRuleTypeDataSource]);

  useEffect(() => {
    if (currentRuleType) {
      setInternalRuleType(currentRuleType);
    }
  }, [currentRuleType]);

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
