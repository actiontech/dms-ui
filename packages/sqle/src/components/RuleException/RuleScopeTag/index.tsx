import { useTranslation } from 'react-i18next';
import { BlacklistResV1RuleScopeModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BasicTag } from '@actiontech/shared';
import { RuleScopeMode } from '../../../page/RuleException/index.type';
import { normalizeRuleScopeList } from '../../../page/RuleException/index.data';

type RuleScopeTagProps = {
  mode?: RuleScopeMode;
  ruleScope?: 'ALL' | string[];
};

const RuleScopeTag: React.FC<RuleScopeTagProps> = ({ mode, ruleScope }) => {
  const { t } = useTranslation();
  const specificRules = normalizeRuleScopeList(ruleScope);
  const isAll =
    mode === BlacklistResV1RuleScopeModeEnum.all || specificRules.length === 0;

  return (
    <BasicTag size="small">
      {isAll
        ? t('ruleException.ruleScope.all')
        : t('ruleException.ruleScope.specific', {
            count: specificRules.length
          })}
    </BasicTag>
  );
};

export default RuleScopeTag;
