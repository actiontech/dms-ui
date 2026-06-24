import { BasicTag } from '@actiontech/dms-kit';
import { t } from '../../../../locale';

export const remediationStatusOptions = [
  'resolved',
  'partially_fixed',
  'unchanged',
  'deteriorated',
  'newly_discovered'
];

type RemediationStatusTagProps = {
  status?: string;
};

const remediationStatusColor: Record<string, string> = {
  resolved: 'green',
  partially_fixed: 'blue',
  unchanged: 'gray',
  deteriorated: 'red',
  newly_discovered: 'orange'
};

const RemediationStatusTag: React.FC<RemediationStatusTagProps> = ({
  status
}) => {
  const currentStatus = status || 'unchanged';

  return (
    <BasicTag color={(remediationStatusColor[currentStatus] ?? 'gray') as any}>
      {t(`sqlManagement.table.remediationStatus.${currentStatus}` as any)}
    </BasicTag>
  );
};

export default RemediationStatusTag;
