import { BasicTag } from '@actiontech/shared';
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
    <BasicTag color={remediationStatusColor[currentStatus] ?? 'gray'}>
      {t(`sqlManagement.table.remediationStatus.${currentStatus}`)}
    </BasicTag>
  );
};

export default RemediationStatusTag;
