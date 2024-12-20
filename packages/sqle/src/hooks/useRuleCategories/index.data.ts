import { t } from '../../locale';

export type DictionaryType = { [key: string]: string };

export const RuleCategoryDictionary: DictionaryType = {
  audit_accuracy: t('rule.category.auditAccuracy'),
  audit_purpose: t('rule.category.auditPurpose'),
  operand: t('rule.category.operand'),
  sql: t('rule.category.sql')
};

export const RuleCategoryOperandDictionary = {
  database: t('rule.category.tag.database'),
  table_space: t('rule.category.tag.tableSpace'),
  table: t('rule.category.tag.table'),
  column: t('rule.category.tag.column'),
  index: t('rule.category.tag.index'),
  view: t('rule.category.tag.view'),
  procedure: t('rule.category.tag.procedure'),
  function: t('rule.category.tag.function'),
  trigger: t('rule.category.tag.trigger'),
  event: t('rule.category.tag.event'),
  user: t('rule.category.tag.user')
};

export const RuleCategorySqlDictionary = {
  ddl: t('rule.category.tag.ddl'),
  dcl: t('rule.category.tag.dcl'),
  dml: t('rule.category.tag.dml'),
  integrity: t('rule.category.tag.integrity'),
  query: t('rule.category.tag.query'),
  transaction: t('rule.category.tag.transaction'),
  privilege: t('rule.category.tag.privilege'),
  management: t('rule.category.tag.management')
};

export const RuleCategoryAuditPurposeDictionary = {
  correction: t('rule.category.tag.correction'),
  security: t('rule.category.tag.security'),
  maintenance: t('rule.category.tag.maintenance'),
  performance: t('rule.category.tag.performance')
};

export const RuleCategoryAuditAccuracyDictionary = {
  online: t('rule.category.tag.online'),
  offline: t('rule.category.tag.offline')
};

export const RuleCategoryDictionaryGroup: { [key: string]: DictionaryType } = {
  audit_accuracy: RuleCategoryAuditAccuracyDictionary,
  audit_purpose: RuleCategoryAuditPurposeDictionary,
  operand: RuleCategoryOperandDictionary,
  sql: RuleCategorySqlDictionary
};
