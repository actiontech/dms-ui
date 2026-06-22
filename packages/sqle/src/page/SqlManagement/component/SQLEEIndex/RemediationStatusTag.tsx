import { BasicTag } from '@actiontech/dms-kit';
import { t } from '../../../../locale';
import { CSSProperties } from 'react';

export const remediationStatusOptions = [
  'resolved',
  'partially_fixed',
  'unchanged',
  'deteriorated',
  'newly_discovered'
] as const;

export type RemediationStatus = (typeof remediationStatusOptions)[number];

type RemediationStatusTagProps = {
  status?: RemediationStatus;
  onClick?: () => void;
};

const clickableStyle: CSSProperties = {
  cursor: 'pointer'
};

const remediationStatusColor: Record<RemediationStatus, string> = {
  resolved: 'green',
  partially_fixed: 'blue',
  unchanged: 'gray',
  deteriorated: 'red',
  newly_discovered: 'orange'
};

const RemediationStatusTag: React.FC<RemediationStatusTagProps> = ({
  status,
  onClick
}) => {
  const currentStatus = status || 'unchanged';

  return (
    <BasicTag
      color={(remediationStatusColor[currentStatus] ?? 'gray') as any}
      onClick={onClick}
      style={onClick ? clickableStyle : undefined}
    >
      {t(`sqlManagement.table.remediationStatus.${currentStatus}` as any)}
    </BasicTag>
  );
};

export default RemediationStatusTag;
