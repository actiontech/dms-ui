import { RuleStatusSegmentedStyleWrapper } from './style';
import { RuleStatusEnum, RuleStatusProps } from './index.type';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const RuleStatus: React.FC<RuleStatusProps> = ({
  currentRuleStatus,
  ruleStatusChange
}) => {
  const { t } = useTranslation();
  const [internalRuleStatus, setInternalRuleStatus] = useState<RuleStatusEnum>(
    currentRuleStatus ?? RuleStatusEnum.enabled
  );

  useEffect(() => {
    if (currentRuleStatus) {
      setInternalRuleStatus(currentRuleStatus);
    }
  }, [currentRuleStatus]);
  return (
    <RuleStatusSegmentedStyleWrapper
      value={internalRuleStatus}
      onChange={(v) => {
        setInternalRuleStatus(v as RuleStatusEnum);
        ruleStatusChange?.(v as RuleStatusEnum);
      }}
      options={[
        {
          label: t('common.enabled'),
          value: RuleStatusEnum.enabled,
          className: 'enabled-rule'
        },
        {
          label: t('common.disabled'),
          value: RuleStatusEnum.disabled,
          className: 'disabled-rule'
        }
      ]}
    />
  );
};
export default RuleStatus;
