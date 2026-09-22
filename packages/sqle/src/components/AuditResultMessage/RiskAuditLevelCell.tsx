import React from 'react';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  getAuditLevelDisplayLabel,
  resolveAuditLevelDisplayMeta
} from './errorPriorityDisplay';

export type RiskAuditLevelSource = {
  audit_level?: string | null;
  error_priority?: string | null;
  audit_error_priority?: string | null;
  /** 报告 SQL 回填的结果项；有则优先用 ResultIconRender 展示三态 */
  audit_result?: Array<{
    level?: string;
    error_priority?: string;
  }>;
  /** 有风险 SQL 但无 level 时，按设计回落为「错误」 */
  risk_sql_count?: number | null;
};

/**
 * 首页 / 项目概览风险列表等级列（S2 §8.10）。
 * level 仍四档；error 下读 priority 三态；无 priority →「错误」。
 */
const RiskAuditLevelCell: React.FC<{ record: RiskAuditLevelSource }> = ({
  record
}) => {
  const { t } = useTranslation();

  if (record.audit_result?.some((item) => item?.level)) {
    const seen = new Set<string>();
    const labels: React.ReactNode[] = [];
    record.audit_result.forEach((item) => {
      if (!item?.level) {
        return;
      }
      const meta = resolveAuditLevelDisplayMeta(
        item.level,
        item.error_priority
      );
      if (seen.has(meta.iconKey)) {
        return;
      }
      seen.add(meta.iconKey);
      const label = t(meta.labelKey);
      labels.push(
        <span
          key={meta.iconKey}
          className={`audit-result-icon audit-result-icon-${meta.iconKey}`}
          data-icon-key={meta.iconKey}
          data-error-priority={meta.dataErrorPriority || undefined}
          aria-label={label}
          title={label}
        >
          {label}
        </span>
      );
    });
    return <Space size={8}>{labels}</Space>;
  }

  const level =
    record.audit_level ||
    (record.risk_sql_count && record.risk_sql_count > 0 ? 'error' : undefined);
  if (!level) {
    return <>-</>;
  }

  const priority =
    record.error_priority || record.audit_error_priority || undefined;
  const meta = resolveAuditLevelDisplayMeta(level, priority);
  const label = getAuditLevelDisplayLabel(t, level, priority);

  return (
    <Space size={4}>
      <span
        className={`audit-result-icon audit-result-icon-${meta.iconKey}`}
        data-icon-key={meta.iconKey}
        data-error-priority={meta.dataErrorPriority || undefined}
        aria-label={label}
        title={label}
      >
        {label}
      </span>
    </Space>
  );
};

export default RiskAuditLevelCell;
