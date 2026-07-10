import { Typography } from 'antd';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { formatMatchModeTypeLabels } from '../../../page/RuleException/utils';
import { AuditWhitelistMatchTypeDirection } from '../../RuleExceptionMatchConditions/index.data';

type MatchModeDisplayProps = {
  record: IAuditWhitelistResV1;
};

const getMatchTypeLabel = (type?: string) => {
  if (
    type &&
    Object.prototype.hasOwnProperty.call(AuditWhitelistMatchTypeDirection, type)
  ) {
    return AuditWhitelistMatchTypeDirection[
      type as keyof typeof AuditWhitelistMatchTypeDirection
    ];
  }
  return type ?? '-';
};

const MatchModeDisplay: React.FC<MatchModeDisplayProps> = ({ record }) => {
  const displayText = formatMatchModeTypeLabels(record, getMatchTypeLabel).join(
    '、'
  );

  if (!displayText) {
    return <Typography.Text type="secondary">-</Typography.Text>;
  }

  return <Typography.Text>{displayText}</Typography.Text>;
};

export default MatchModeDisplay;
