import type { TFunction } from 'i18next';

/** S1 §6.2：仅当 level===error 时优先级有意义；空=未分级 */
export type ErrorPriorityValue = 'P0' | 'P1' | '';

export type AuditLevelIconKey =
  | 'normal'
  | 'notice'
  | 'warn'
  | 'error'
  | 'error_P0'
  | 'error_P1';

export type AuditLevelDisplayMeta = {
  /** 去重 / DOM class / data-icon-key */
  iconKey: AuditLevelIconKey;
  /** i18n key under components.auditResultMessage.level */
  labelKey: string;
  /** 归一化后的优先级；非 error 恒为 '' */
  errorPriority: ErrorPriorityValue;
  /** 写入 data-error-priority：P0 / P1 / 空 */
  dataErrorPriority: string;
};

export const normalizeErrorPriority = (
  errorPriority?: string | null
): ErrorPriorityValue => {
  const raw = (errorPriority ?? '').trim().toUpperCase();
  if (raw === 'P0') {
    return 'P0';
  }
  if (raw === 'P1') {
    return 'P1';
  }
  return '';
};

/**
 * 三态展示映射（S1 §6.2 权威表）。
 * level 仍为四档；P0/P1 不是第五档 level。
 */
export const resolveAuditLevelDisplayMeta = (
  level?: string | null,
  errorPriority?: string | null
): AuditLevelDisplayMeta => {
  const normalizedLevel = (level ?? '').trim().toLowerCase();

  if (
    !normalizedLevel ||
    normalizedLevel === 'normal' ||
    normalizedLevel === 'unknown'
  ) {
    return {
      iconKey: 'normal',
      labelKey: 'components.auditResultMessage.level.normal',
      errorPriority: '',
      dataErrorPriority: ''
    };
  }

  if (normalizedLevel === 'notice') {
    return {
      iconKey: 'notice',
      labelKey: 'components.auditResultMessage.level.notice',
      errorPriority: '',
      dataErrorPriority: ''
    };
  }

  if (normalizedLevel === 'warn' || normalizedLevel === 'warning') {
    return {
      iconKey: 'warn',
      labelKey: 'components.auditResultMessage.level.warn',
      errorPriority: '',
      dataErrorPriority: ''
    };
  }

  if (normalizedLevel === 'error') {
    const priority = normalizeErrorPriority(errorPriority);
    if (priority === 'P0') {
      return {
        iconKey: 'error_P0',
        labelKey: 'components.auditResultMessage.level.error_P0',
        errorPriority: 'P0',
        dataErrorPriority: 'P0'
      };
    }
    if (priority === 'P1') {
      return {
        iconKey: 'error_P1',
        labelKey: 'components.auditResultMessage.level.error_P1',
        errorPriority: 'P1',
        dataErrorPriority: 'P1'
      };
    }
    return {
      iconKey: 'error',
      labelKey: 'components.auditResultMessage.level.error',
      errorPriority: '',
      dataErrorPriority: ''
    };
  }

  return {
    iconKey: 'normal',
    labelKey: 'components.auditResultMessage.level.normal',
    errorPriority: '',
    dataErrorPriority: ''
  };
};

export const getAuditLevelDisplayLabel = (
  t: TFunction,
  level?: string | null,
  errorPriority?: string | null
) => {
  const meta = resolveAuditLevelDisplayMeta(level, errorPriority);
  return t(meta.labelKey);
};

/** ResultIconRender / 摘要去重键：error+P0 与 error+P1 不得合并 */
export const getAuditResultIconDedupKey = (
  level?: string | null,
  errorPriority?: string | null
) => {
  const meta = resolveAuditLevelDisplayMeta(level, errorPriority);
  return meta.iconKey;
};

/**
 * 规则配置侧展示/提交：level=error 且 priority 空时按产品默认 P1；
 * 非 error 恒为 ''。
 */
export const resolveRuleConfigErrorPriority = (
  level?: string | null,
  errorPriority?: string | null
): ErrorPriorityValue => {
  const normalizedLevel = (level ?? '').trim().toLowerCase();
  if (normalizedLevel !== 'error') {
    return '';
  }
  return normalizeErrorPriority(errorPriority) || 'P1';
};
