import { BasicTag } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Space } from 'antd';
import { IAuditSQLResult } from '@actiontech/shared/lib/api/base/service/common';
import {
  ProfileSquareFilled,
  ExclamationHexagonFilled,
  WarningFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  MinusCircleFilled
} from '@actiontech/icons';
import {
  getAuditResultIconDedupKey,
  resolveAuditLevelDisplayMeta,
  type AuditLevelIconKey
} from 'sqle/src/components/AuditResultMessage/errorPriorityDisplay';

export type AuditResultTagProps = {
  auditResult?: IAuditSQLResult[];
};

type AuditResultWithPriority = IAuditSQLResult & { error_priority?: string };

/** 卡片计数展示顺序：P0 > P1 > 未分级 error > warn > notice > normal */
const TAG_DISPLAY_ORDER: AuditLevelIconKey[] = [
  'error_P0',
  'error_P1',
  'error',
  'warn',
  'notice',
  'normal'
];

const countResultsByDisplayKey = (
  auditResult?: AuditResultWithPriority[]
): Partial<Record<AuditLevelIconKey, number>> => {
  const counts: Partial<Record<AuditLevelIconKey, number>> = {};
  if (!Array.isArray(auditResult)) {
    return counts;
  }
  auditResult.forEach((item) => {
    const level = item.level ?? '';
    if (!level) {
      return;
    }
    const key = getAuditResultIconDedupKey(level, item.error_priority);
    if (!TAG_DISPLAY_ORDER.includes(key)) {
      return;
    }
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return counts;
};

const AuditResultTag: React.FC<AuditResultTagProps> = ({ auditResult }) => {
  const { t } = useTranslation();

  const activeAuditResult = useMemo(
    () => (auditResult ?? []) as AuditResultWithPriority[],
    [auditResult]
  );

  const displayCounts = useMemo(
    () => countResultsByDisplayKey(activeAuditResult),
    [activeAuditResult]
  );

  if (!activeAuditResult.length) {
    return (
      <BasicTag
        color="green"
        size="large"
        icon={<CheckCircleFilled />}
        bordered={false}
      >
        {t('audit.auditSuccess')}
      </BasicTag>
    );
  }

  return (
    <Space className="audit-result-tag" wrap>
      {TAG_DISPLAY_ORDER.map((iconKey) => {
        const count = displayCounts[iconKey];
        if (!count) {
          return null;
        }

        const meta = resolveAuditLevelDisplayMeta(
          iconKey.startsWith('error') ? 'error' : iconKey,
          iconKey === 'error_P0' ? 'P0' : iconKey === 'error_P1' ? 'P1' : ''
        );
        const label = t(meta.labelKey);
        const isErrorFamily = iconKey.startsWith('error');

        if (iconKey === 'normal') {
          return (
            <BasicTag
              key={iconKey}
              className={`audit-result-tag-item audit-result-tag-item-${iconKey}`}
              color="gray"
              size="large"
              icon={<ProfileSquareFilled width={18} height={19} />}
              bordered={false}
              data-icon-key={iconKey}
              aria-label={label}
              title={label}
            >
              {count}
            </BasicTag>
          );
        }

        if (iconKey === 'notice') {
          return (
            <BasicTag
              key={iconKey}
              className={`audit-result-tag-item audit-result-tag-item-${iconKey}`}
              color="blue"
              size="large"
              icon={<ExclamationHexagonFilled width={18} height={19} />}
              bordered={false}
              data-icon-key={iconKey}
              aria-label={label}
              title={label}
            >
              {count}
            </BasicTag>
          );
        }

        if (iconKey === 'warn') {
          return (
            <BasicTag
              key={iconKey}
              className={`audit-result-tag-item audit-result-tag-item-${iconKey}`}
              color="orange"
              size="large"
              icon={<WarningFilled width={18} height={19} />}
              bordered={false}
              data-icon-key={iconKey}
              aria-label={label}
              title={label}
            >
              {count}
            </BasicTag>
          );
        }

        // error / error_P0 / error_P1：文案分列，不得合并为单一「错误」总数
        const icon =
          iconKey === 'error_P1' ? (
            <MinusCircleFilled width={16} height={16} color="#FA8C16" />
          ) : (
            <CloseCircleFilled
              width={16}
              height={16}
              color={iconKey === 'error_P0' ? '#C41D3A' : undefined}
            />
          );

        return (
          <BasicTag
            key={iconKey}
            className={`audit-result-tag-item audit-result-tag-item-${iconKey}`}
            color={iconKey === 'error_P1' ? 'orange' : 'red'}
            size="large"
            icon={icon}
            bordered={false}
            data-icon-key={iconKey}
            data-error-priority={
              isErrorFamily ? meta.dataErrorPriority || 'ungraded' : undefined
            }
            aria-label={label}
            title={label}
          >
            <span className="audit-result-tag-label">{label}</span>
            <span className="audit-result-tag-count"> {count}</span>
          </BasicTag>
        );
      })}
    </Space>
  );
};

export default AuditResultTag;
