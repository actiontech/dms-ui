import React, { useMemo } from 'react';
import { Space } from 'antd';
import {
  CheckCircleFilled,
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled,
  MinusCircleFilled
} from '@actiontech/icons';
import { useTranslation } from 'react-i18next';
import { ResultIconRenderProps } from './index.type';
import {
  AuditLevelIconKey,
  getAuditResultIconDedupKey,
  resolveAuditLevelDisplayMeta
} from './errorPriorityDisplay';

const IconByKey: Record<AuditLevelIconKey, React.ReactNode> = {
  normal: <CheckCircleFilled width={20} height={20} />,
  notice: <InfoHexagonFilled width={20} height={20} />,
  warn: <WarningFilled width={20} height={20} />,
  // 未分级 error：沿用现网图标
  error: <CloseCircleFilled width={20} height={20} />,
  // P0 / P1 使用可区分图标（不得去重成同一种）
  error_P0: <CloseCircleFilled width={20} height={20} color="#C41D3A" />,
  error_P1: <MinusCircleFilled width={20} height={20} color="#FA8C16" />
};

/** @deprecated use ResultIconRenderProps instead */
export type IResultIconRender = {
  iconLevels: string[];
};

const ResultIconRender = (props: ResultIconRenderProps) => {
  const { auditResultInfo, iconLevels } = props;
  const { t } = useTranslation();

  const legacyIconData = useMemo(() => {
    return Array.from(
      new Set((iconLevels ?? []).filter((icon: string) => icon))
    );
  }, [iconLevels]);

  const auditResultIconKeys = useMemo(() => {
    const keys: AuditLevelIconKey[] = [];
    const seen = new Set<string>();
    auditResultInfo?.forEach((item) => {
      if (!item?.level) {
        return;
      }
      const dedupKey = getAuditResultIconDedupKey(
        item.level,
        item.error_priority
      );
      if (seen.has(dedupKey)) {
        return;
      }
      seen.add(dedupKey);
      keys.push(dedupKey);
    });
    return keys;
  }, [auditResultInfo]);

  if (auditResultInfo) {
    if (auditResultInfo.some((item) => item.executionFailed)) {
      return (
        <Space>
          <WarningFilled width={20} height={20} />
          <span>{t('components.auditResultMessage.hasException')}</span>
        </Space>
      );
    }

    return (
      <Space size={8}>
        {auditResultIconKeys.length
          ? auditResultIconKeys.map((iconKey) => {
              const meta = resolveAuditLevelDisplayMeta(
                iconKey.startsWith('error') ? 'error' : iconKey,
                iconKey === 'error_P0'
                  ? 'P0'
                  : iconKey === 'error_P1'
                  ? 'P1'
                  : ''
              );
              const label = t(meta.labelKey);
              return (
                <span
                  key={iconKey}
                  className={`audit-result-icon audit-result-icon-${iconKey}`}
                  data-icon-key={iconKey}
                  data-error-priority={meta.dataErrorPriority || undefined}
                  aria-label={label}
                  title={label}
                >
                  {IconByKey[iconKey] ?? null}
                </span>
              );
            })
          : IconByKey.normal}
      </Space>
    );
  }

  return (
    <Space size={8}>
      {legacyIconData.map((icon) => (
        <React.Fragment key={icon}>
          {IconByKey[icon as AuditLevelIconKey] ??
            (icon === 'error' ? IconByKey.error : null)}
        </React.Fragment>
      ))}
    </Space>
  );
};

export default ResultIconRender;
