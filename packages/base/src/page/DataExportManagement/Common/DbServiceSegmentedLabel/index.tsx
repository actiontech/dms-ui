import {
  ProfileSquareFilled,
  ExclamationHexagonFilled,
  WarningFilled,
  CloseCircleFilled
} from '@actiontech/icons';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { DbServiceSegmentedLabelStyleWrapper } from './style';
import { DbServiceSegmentedLabelProps } from './index.type';

const DbServiceSegmentedLabel: React.FC<DbServiceSegmentedLabelProps> = ({
  auditLevel,
  dbServiceName
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
    <DbServiceSegmentedLabelStyleWrapper className="db-service-segmented-label">
      <span className="db-service-segmented-label-text">{dbServiceName}</span>
      <span className="db-service-segmented-label-icon">{levelIcon()}</span>
    </DbServiceSegmentedLabelStyleWrapper>
  );
};

export default DbServiceSegmentedLabel;
