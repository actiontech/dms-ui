import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import {
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled,
  MinusCircleFilled
} from '@actiontech/icons';
import {
  IAuditResult,
  ISkippedByRuleExceptionItem
} from '@actiontech/shared/lib/api/sqle/service/common';
import AuditResultMessage from './index';
import {
  hasAuditViolations,
  resolveSkippedRuleExceptionDisplayLevel
} from './auditLevelUtils';
import { AuditLevelSummaryStyleWrapper } from './style';
import {
  buildAuditResultDisplayBuckets,
  isFullSqlExemption
} from '../../page/RuleException/index.data';
import {
  AuditLevelIconKey,
  getAuditResultIconDedupKey,
  resolveAuditLevelDisplayMeta
} from './errorPriorityDisplay';

const SUMMARY_ICON_MAP: Record<
  AuditLevelIconKey,
  FC<{ width?: number; height?: number; color?: string }> | null
> = {
  normal: null,
  notice: InfoHexagonFilled,
  warn: WarningFilled,
  error: CloseCircleFilled,
  error_P0: CloseCircleFilled,
  error_P1: MinusCircleFilled
};

const SUMMARY_ICON_COLOR: Partial<Record<AuditLevelIconKey, string>> = {
  error_P0: '#C41D3A',
  error_P1: '#FA8C16'
};

/** 摘要展示顺序：P0 > P1 > 未分级 error > warn > notice */
const SUMMARY_DISPLAY_ORDER: AuditLevelIconKey[] = [
  'error_P0',
  'error_P1',
  'error',
  'warn',
  'notice'
];

type AuditResultWithPriority = IAuditResult & { error_priority?: string };

const countActiveResultsByDisplayKey = (
  auditResults?: AuditResultWithPriority[]
): Partial<Record<AuditLevelIconKey, number>> => {
  const counts: Partial<Record<AuditLevelIconKey, number>> = {};
  if (!Array.isArray(auditResults)) {
    return counts;
  }
  auditResults.forEach((item) => {
    const level = item.level ?? '';
    if (!level || level === 'normal' || level === 'UNKNOWN') {
      return;
    }
    const key = getAuditResultIconDedupKey(level, item.error_priority);
    if (!SUMMARY_DISPLAY_ORDER.includes(key)) {
      return;
    }
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return counts;
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

  const activeDisplayCounts = useMemo(
    () => countActiveResultsByDisplayKey(active as AuditResultWithPriority[]),
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
        {SUMMARY_DISPLAY_ORDER.map((iconKey) => {
          const count = activeDisplayCounts[iconKey];
          if (!count) {
            return null;
          }

          const Icon = SUMMARY_ICON_MAP[iconKey];
          if (!Icon) {
            return null;
          }

          const meta = resolveAuditLevelDisplayMeta(
            iconKey.startsWith('error') ? 'error' : iconKey,
            iconKey === 'error_P0' ? 'P0' : iconKey === 'error_P1' ? 'P1' : ''
          );
          const label = t(meta.labelKey);
          const color = SUMMARY_ICON_COLOR[iconKey];

          return (
            <span
              key={iconKey}
              className={`audit-level-summary-item audit-level-summary-item-${iconKey}`}
              data-icon-key={iconKey}
              data-error-priority={meta.dataErrorPriority || undefined}
              aria-label={label}
              title={label}
            >
              <Icon width={20} height={20} color={color} />
              <span className="audit-level-summary-label">{label}</span>
              <span className="audit-level-summary-count">× {count}</span>
            </span>
          );
        })}
      </Space>
    </AuditLevelSummaryStyleWrapper>
  );
};

export default AuditResultExemptionSummary;
