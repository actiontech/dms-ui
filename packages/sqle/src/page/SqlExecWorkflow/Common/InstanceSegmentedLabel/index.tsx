import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { InstanceSegmentedLabelStyleWrapper } from './style';
import {
  ProfileSquareFilled,
  ExclamationHexagonFilled,
  WarningFilled,
  CloseCircleFilled,
  MinusCircleFilled
} from '@actiontech/icons';
import { useTranslation } from 'react-i18next';
import { resolveAuditLevelDisplayMeta } from '../../../../components/AuditResultMessage/errorPriorityDisplay';

export type InstanceSegmentedLabelProps = {
  auditLevel?: AuditTaskResV1AuditLevelEnum;
  /** 任务/实例侧最高错误优先级（正交于 audit_level；空=未分级） */
  auditErrorPriority?: string | null;
  instanceName: string;
};

const InstanceSegmentedLabel: React.FC<InstanceSegmentedLabelProps> = ({
  auditLevel,
  auditErrorPriority,
  instanceName
}) => {
  const { t } = useTranslation();
  const display = resolveAuditLevelDisplayMeta(auditLevel, auditErrorPriority);

  const levelIcon = () => {
    if (display.iconKey === 'error_P0') {
      return <CloseCircleFilled width={14} height={14} color="#C41D3A" />;
    }
    if (display.iconKey === 'error_P1') {
      return <MinusCircleFilled width={14} height={14} color="#FA8C16" />;
    }
    if (display.iconKey === 'error') {
      return <CloseCircleFilled width={14} height={14} />;
    }
    if (display.iconKey === 'normal') {
      return <ProfileSquareFilled width={14} height={14} />;
    }
    if (display.iconKey === 'notice') {
      return <ExclamationHexagonFilled width={14} height={14} />;
    }
    if (display.iconKey === 'warn') {
      return <WarningFilled width={14} height={14} />;
    }
    return null;
  };

  const showErrorPriorityBadge =
    display.iconKey === 'error_P0' ||
    display.iconKey === 'error_P1' ||
    display.iconKey === 'error';

  return (
    <InstanceSegmentedLabelStyleWrapper
      className={`instance-segmented-label instance-segmented-label--${display.iconKey}`}
      data-audit-error-priority={
        display.dataErrorPriority ||
        (display.iconKey === 'error' ? 'ungraded' : undefined)
      }
      data-error-priority={display.dataErrorPriority || undefined}
      title={showErrorPriorityBadge ? t(display.labelKey) : undefined}
    >
      <span className="instance-segmented-label-text">{instanceName}</span>
      <span className="instance-segmented-label-icon">{levelIcon()}</span>
      {showErrorPriorityBadge ? (
        <span className="instance-segmented-label-priority">
          {t(display.labelKey)}
        </span>
      ) : null}
    </InstanceSegmentedLabelStyleWrapper>
  );
};

export default InstanceSegmentedLabel;
