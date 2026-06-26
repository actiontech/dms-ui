import i18n, { TFunction } from 'i18next';
import type { IAuditResultWithExtra } from './index.type';

type I18nInstance = typeof i18n;

export type AuditResultDisplaySource = Pick<
  IAuditResultWithExtra,
  'rule_name' | 'message' | 'desc' | 'i18n_audit_result_info'
>;

export type AuditResultDisplayMode = 'ruleDesc' | 'ruleKey';

const RULE_I18N_KEY_CANDIDATES = (ruleName: string) => [
  `sqleRule.${ruleName}.desc`,
  `rule.${ruleName}.desc`
];

const resolveRuleI18nDesc = (
  ruleName: string,
  t: TFunction,
  i18nInstance: I18nInstance = i18n
) => {
  for (const key of RULE_I18N_KEY_CANDIDATES(ruleName)) {
    if (i18nInstance.exists(key)) {
      return t(key);
    }
  }
  return '';
};

const resolveI18nAuditResultMessage = (
  i18nAuditResultInfo?: AuditResultDisplaySource['i18n_audit_result_info'],
  language?: string
) => {
  if (!i18nAuditResultInfo) {
    return '';
  }

  const normalizedLanguage = (language ?? i18n.language ?? '').replace(
    '-',
    '_'
  );
  const languageCandidates = [
    language,
    normalizedLanguage,
    normalizedLanguage.split('_')[0],
    'zh',
    'zh_CN',
    'zh-CN'
  ].filter(Boolean) as string[];

  for (const lang of languageCandidates) {
    const message = i18nAuditResultInfo[lang]?.message;
    if (message) {
      return message;
    }
  }

  const firstMessage = Object.values(i18nAuditResultInfo).find(
    (item) => !!item?.message
  )?.message;

  return firstMessage ?? '';
};

export const getAuditResultDisplayText = (
  auditResult: AuditResultDisplaySource | undefined,
  t: TFunction,
  options?: {
    displayMode?: AuditResultDisplayMode;
    i18nInstance?: I18nInstance;
  }
) => {
  if (!auditResult) {
    return '';
  }

  const { rule_name, message, desc, i18n_audit_result_info } = auditResult;
  const displayMode = options?.displayMode ?? 'ruleDesc';
  const i18nInstance = options?.i18nInstance ?? i18n;

  if (displayMode === 'ruleKey') {
    if (rule_name) {
      return rule_name;
    }
    if (message) {
      return message;
    }
    return '';
  }

  if (rule_name) {
    const ruleI18nDesc = resolveRuleI18nDesc(rule_name, t, i18nInstance);
    if (ruleI18nDesc) {
      return ruleI18nDesc;
    }
  }

  if (desc) {
    return desc;
  }

  const i18nMessage = resolveI18nAuditResultMessage(
    i18n_audit_result_info,
    i18nInstance.language
  );
  if (i18nMessage) {
    return i18nMessage;
  }

  if (message) {
    return message;
  }

  return '';
};
