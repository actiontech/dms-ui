import { RuleStatusSegmentedStyleWrapper } from './style';
import { RuleStatusEnum, RuleStatusProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { useControllableValue } from 'ahooks';

const RuleStatus: React.FC<RuleStatusProps> = ({
  currentRuleStatus,
  ruleStatusChange
}) => {
  const { t } = useTranslation();

  const [internalRuleStatus, setInternalRuleStatus] =
    useControllableValue<RuleStatusEnum>(
      typeof currentRuleStatus !== 'undefined' && ruleStatusChange
        ? {
            value: currentRuleStatus,
            onChange: ruleStatusChange,
            defaultValue: RuleStatusEnum.enabled
          }
        : {
            defaultValue: RuleStatusEnum.enabled
          }
    );

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
