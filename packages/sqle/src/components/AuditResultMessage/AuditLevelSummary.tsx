import { useMemo, type FC } from 'react';
import { Space } from 'antd';
import {
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled
} from '@actiontech/icons';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import AuditResultMessage from './index';
import {
  AUDIT_LEVEL_DISPLAY_ORDER,
  AuditLevelSummaryKey,
  countAuditResultsByLevel,
  hasAuditViolations
} from './auditLevelUtils';
import { AuditLevelSummaryStyleWrapper } from './style';

const LEVEL_ICON_MAP: Record<
  AuditLevelSummaryKey,
  FC<{ width?: number; height?: number }>
> = {
  error: CloseCircleFilled,
  warn: WarningFilled,
  notice: InfoHexagonFilled
};

export type AuditLevelSummaryProps = {
  auditResults?: IAuditResult[];
};

const AuditLevelSummary = ({ auditResults }: AuditLevelSummaryProps) => {
  const levelCounts = useMemo(
    () => countAuditResultsByLevel(auditResults),
    [auditResults]
  );

  if (!hasAuditViolations(auditResults)) {
    return <AuditResultMessage auditResult={{}} />;
  }

  return (
    <AuditLevelSummaryStyleWrapper>
      <Space size={12}>
        {AUDIT_LEVEL_DISPLAY_ORDER.map((level) => {
          const count = levelCounts[level];
          if (!count) {
            return null;
          }

          const Icon = LEVEL_ICON_MAP[level];

          return (
            <span key={level} className="audit-level-summary-item">
              <Icon width={20} height={20} />
              <span className="audit-level-summary-count">× {count}</span>
            </span>
          );
        })}
      </Space>
    </AuditLevelSummaryStyleWrapper>
  );
};

export default AuditLevelSummary;
