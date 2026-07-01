import { Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BlacklistResV1RuleScopeModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BasicTag } from '@actiontech/shared';
import { formatRuleScope } from '../../../page/RuleException/utils';

type RuleScopeDisplayProps = {
  record: IBlacklistResV1;
  modeOnly?: boolean;
};

const RuleScopeDisplay: React.FC<RuleScopeDisplayProps> = ({
  record,
  modeOnly = false
}) => {
  const { t } = useTranslation();
  const { mode, ruleLabels } = formatRuleScope(record);
  const isAll = mode === BlacklistResV1RuleScopeModeEnum.all;

  if (modeOnly) {
    return (
      <Typography.Text>
        {isAll
          ? t('ruleException.form.ruleScopeAll')
          : t('ruleException.form.ruleScopeSpecific')}
      </Typography.Text>
    );
  }

  return (
    <Space direction="vertical" size={4}>
      <BasicTag size="small">
        {isAll
          ? t('ruleException.ruleScope.all')
          : t('ruleException.ruleScope.specific', {
              count: ruleLabels.length
            })}
      </BasicTag>
      {!isAll && ruleLabels.length ? (
        <Typography.Text type="secondary">
          {ruleLabels.join('、')}
        </Typography.Text>
      ) : null}
    </Space>
  );
};

export default RuleScopeDisplay;
