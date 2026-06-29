import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import { IMatchConditionReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { normalizeMatchConditionsForRead } from '../../../page/RuleException/utils';
import { SqlManagementExceptionMatchTypeDirection } from '../../../page/SqlManagementException/index.data';

type MatchConditionsSummaryProps = {
  matchConditions?: IMatchConditionReqV1[] | null;
};

const MatchConditionsSummary: React.FC<MatchConditionsSummaryProps> = ({
  matchConditions
}) => {
  const { t } = useTranslation();
  const normalized = normalizeMatchConditionsForRead(matchConditions);

  if (!normalized.length) {
    return (
      <Typography.Text type="secondary">
        {t('ruleException.matchConditionsSummary.empty')}
      </Typography.Text>
    );
  }

  return (
    <Typography.Text>
      {normalized
        .map((item) => {
          const typeLabel =
            item.type &&
            Object.prototype.hasOwnProperty.call(
              SqlManagementExceptionMatchTypeDirection,
              item.type
            )
              ? SqlManagementExceptionMatchTypeDirection[
                  item.type as keyof typeof SqlManagementExceptionMatchTypeDirection
                ]
              : item.type;
          return t('ruleException.matchConditionsSummary.item', {
            type: typeLabel,
            content: item.content
          });
        })
        .join('；')}
    </Typography.Text>
  );
};

export default MatchConditionsSummary;
