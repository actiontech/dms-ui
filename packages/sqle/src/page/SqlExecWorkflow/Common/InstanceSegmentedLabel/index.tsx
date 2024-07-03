import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { InstanceSegmentedLabelStyleWrapper } from './style';
import {
  ProfileSquareFilled,
  ExclamationHexagonFilled,
  WarningFilled,
  CloseCircleFilled
} from '@actiontech/icons';

export type InstanceSegmentedLabelProps = {
  auditLevel?: AuditTaskResV1AuditLevelEnum;
  instanceName: string;
};

const InstanceSegmentedLabel: React.FC<InstanceSegmentedLabelProps> = ({
  auditLevel,
  instanceName
}) => {
  const levelIcon = () => {
    if (auditLevel === AuditTaskResV1AuditLevelEnum.error) {
      return <CloseCircleFilled width={14} height={14} />;
    } else if (auditLevel === AuditTaskResV1AuditLevelEnum.normal) {
      return <ProfileSquareFilled width={14} height={14} />;
    } else if (auditLevel === AuditTaskResV1AuditLevelEnum.notice) {
      return <ExclamationHexagonFilled width={14} height={14} />;
    } else if (auditLevel === AuditTaskResV1AuditLevelEnum.warn) {
      return <WarningFilled width={14} height={14} />;
    }
    return null;
  };

  return (
    <InstanceSegmentedLabelStyleWrapper className="instance-segmented-label">
      <span className="instance-segmented-label-text">{instanceName}</span>
      <span className="instance-segmented-label-icon">{levelIcon()}</span>
    </InstanceSegmentedLabelStyleWrapper>
  );
};

export default InstanceSegmentedLabel;
