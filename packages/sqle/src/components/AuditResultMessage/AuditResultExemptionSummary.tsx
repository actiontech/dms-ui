import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import {
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled
} from '@actiontech/icons';
import {
  IAuditResult,
  ISkippedByRuleExceptionItem
} from '@actiontech/shared/lib/api/sqle/service/common';
import AuditResultMessage from './index';
import {
  AUDIT_LEVEL_DISPLAY_ORDER,
  AuditLevelSummaryKey,
  countAuditResultsByLevel,
  hasAuditViolations,
  resolveSkippedRuleExceptionDisplayLevel
} from './auditLevelUtils';
import { AuditLevelSummaryStyleWrapper } from './style';
import {
  buildAuditResultDisplayBuckets,
  isFullSqlExemption
} from '../../page/RuleException/index.data';

const LEVEL_ICON_MAP: Record<
  AuditLevelSummaryKey,
  FC<{ width?: number; height?: number }>
> = {
  error: CloseCircleFilled,
  warn: WarningFilled,
  notice: InfoHexagonFilled
};

export type AuditResultExemptionSummaryProps = {
  auditResults?: IAuditResult[];
  skippedByRuleException?: ISkippedByRuleExceptionItem[];
  auditLevel?: string;
  auditStatus?: string;
};

const AuditResultExemptionSummary = ({
  auditResults,
  skippedByRuleException,
  auditStatus
}: AuditResultExemptionSummaryProps) => {
  const { t } = useTranslation();

  const sqlExemptionAuditResult = useMemo(
    () => ({
      message: t('ruleException.tag.sqlExemption'),
      level: 'normal'
    }),
    [t]
  );

  const { active, exempted } = useMemo(
    () =>
      buildAuditResultDisplayBuckets(
        auditResults ?? [],
        skippedByRuleException ?? []
      ),
    [auditResults, skippedByRuleException]
  );

  const fullSqlExemption = useMemo(
    () =>
      isFullSqlExemption({
        audit_result: active,
        skipped_by_rule_exception: exempted
      }),
    [active, exempted]
  );

  const activeLevelCounts = useMemo(
    () => countAuditResultsByLevel(active),
    [active]
  );

  const singleExemptedResult = useMemo(() => {
    if (fullSqlExemption || active.length > 0 || exempted.length !== 1) {
      return null;
    }
    return exempted[0];
  }, [active.length, exempted, fullSqlExemption]);

  if (fullSqlExemption) {
    return (
      <AuditResultMessage
        auditStatus={auditStatus}
        auditResult={sqlExemptionAuditResult}
      />
    );
  }

  if (singleExemptedResult) {
    return (
      <AuditResultMessage
        auditStatus={auditStatus}
        auditResult={{
          ...singleExemptedResult,
          level: resolveSkippedRuleExceptionDisplayLevel(singleExemptedResult)
        }}
      />
    );
  }

  const hasActiveViolations = hasAuditViolations(active);

  if (!hasActiveViolations) {
    return <AuditResultMessage auditResult={{}} auditStatus={auditStatus} />;
  }

  return (
    <AuditLevelSummaryStyleWrapper>
      <Space size={12} wrap align="center">
        {AUDIT_LEVEL_DISPLAY_ORDER.map((level) => {
          const count = activeLevelCounts[level];
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

export default AuditResultExemptionSummary;
