import { Typography } from 'antd';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  formatMatchModeDisplayText,
  formatMatchModeTypeLabels
} from '../../../page/RuleException/utils';
import { SqlManagementExceptionMatchTypeDirection } from '../../../page/SqlManagementException/index.data';

type MatchModeDisplayProps = {
  record: IBlacklistResV1;
  labelsOnly?: boolean;
};

const getMatchTypeLabel = (type?: string) => {
  if (
    type &&
    Object.prototype.hasOwnProperty.call(
      SqlManagementExceptionMatchTypeDirection,
      type
    )
  ) {
    return SqlManagementExceptionMatchTypeDirection[
      type as keyof typeof SqlManagementExceptionMatchTypeDirection
    ];
  }
  return type ?? '-';
};

const MatchModeDisplay: React.FC<MatchModeDisplayProps> = ({
  record,
  labelsOnly = false
}) => {
  const displayText = labelsOnly
    ? formatMatchModeTypeLabels(record, getMatchTypeLabel).join('、')
    : formatMatchModeDisplayText(record, getMatchTypeLabel);

  if (!displayText) {
    return <Typography.Text type="secondary">-</Typography.Text>;
  }

  return <Typography.Text>{displayText}</Typography.Text>;
};

export default MatchModeDisplay;
