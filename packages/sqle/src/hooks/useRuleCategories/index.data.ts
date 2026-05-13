import { t } from '../../locale';

export type DictionaryType = { [key: string]: string };

// Use getter functions instead of static constants so that t() is called at
// render time, returning the translation for the *current* language rather
// than the language that was active when the module was first imported.

export const getRuleCategoryDictionary = (): DictionaryType => ({
  audit_accuracy: t('rule.category.auditAccuracy'),
  audit_purpose: t('rule.category.auditPurpose'),
  operand: t('rule.category.operand'),
  sql: t('rule.category.sql'),
  performance_cost: t('rule.category.performanceCost')
});

export const getRuleCategoryOperandDictionary = (): DictionaryType => ({
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
  user: t('rule.category.tag.user'),
  sequence: t('rule.category.tag.sequence'),
  business: t('rule.category.tag.business')
});

export const getRuleCategorySqlDictionary = (): DictionaryType => ({
  ddl: t('rule.category.tag.ddl'),
  dcl: t('rule.category.tag.dcl'),
  dml: t('rule.category.tag.dml'),
  integrity: t('rule.category.tag.integrity'),
  query: t('rule.category.tag.query'),
  transaction: t('rule.category.tag.transaction'),
  privilege: t('rule.category.tag.privilege'),
  management: t('rule.category.tag.management'),
  complete: t('rule.category.tag.complete'),
  join: t('rule.category.tag.join'),
  sql_table_space: t('rule.category.tag.table_space'),
  sql_function: t('rule.category.tag.function'),
  sql_procedure: t('rule.category.tag.procedure'),
  sql_trigger: t('rule.category.tag.trigger'),
  sql_view: t('rule.category.tag.view')
});

export const getRuleCategoryAuditPurposeDictionary = (): DictionaryType => ({
  correction: t('rule.category.tag.correction'),
  security: t('rule.category.tag.security'),
  maintenance: t('rule.category.tag.maintenance'),
  performance: t('rule.category.tag.performance')
});

export const getRuleCategoryAuditAccuracyDictionary = (): DictionaryType => ({
  online: t('rule.category.tag.online'),
  offline: t('rule.category.tag.offline')
});

export const getRuleCategoryPerformanceCostDictionary = (): DictionaryType => ({
  high: t('rule.category.tag.high'),
  medium: t('rule.category.tag.medium'),
  low: t('rule.category.tag.low')
});

export const getRuleCategoryDictionaryGroup = (): {
  [key: string]: DictionaryType;
} => ({
  audit_accuracy: getRuleCategoryAuditAccuracyDictionary(),
  audit_purpose: getRuleCategoryAuditPurposeDictionary(),
  operand: getRuleCategoryOperandDictionary(),
  sql: getRuleCategorySqlDictionary(),
  performance_cost: getRuleCategoryPerformanceCostDictionary()
});

// Backward-compatible aliases: these are kept so that existing imports
// continue to compile, but they still evaluate t() lazily via Proxy.
const makeLazyDict = (getter: () => DictionaryType): DictionaryType =>
  new Proxy(
    {},
    {
      get(_target, prop: string) {
        return getter()[prop];
      },
      ownKeys() {
        return Object.keys(getter());
      },
      getOwnPropertyDescriptor(_target, prop: string) {
        const val = getter()[prop];
        if (val !== undefined) {
          return { configurable: true, enumerable: true, value: val };
        }
        return undefined;
      }
    }
  );

export const RuleCategoryDictionary: DictionaryType = makeLazyDict(
  getRuleCategoryDictionary
);
export const RuleCategoryOperandDictionary: DictionaryType = makeLazyDict(
  getRuleCategoryOperandDictionary
);
export const RuleCategorySqlDictionary: DictionaryType = makeLazyDict(
  getRuleCategorySqlDictionary
);
export const RuleCategoryAuditPurposeDictionary: DictionaryType = makeLazyDict(
  getRuleCategoryAuditPurposeDictionary
);
export const RuleCategoryAuditAccuracyDictionary: DictionaryType = makeLazyDict(
  getRuleCategoryAuditAccuracyDictionary
);
export const RuleCategoryPerformanceCostDictionary: DictionaryType =
  makeLazyDict(getRuleCategoryPerformanceCostDictionary);
export const RuleCategoryDictionaryGroup: { [key: string]: DictionaryType } =
  new Proxy({} as { [key: string]: DictionaryType }, {
    get(_target, prop: string) {
      return getRuleCategoryDictionaryGroup()[prop];
    },
    ownKeys() {
      return Object.keys(getRuleCategoryDictionaryGroup());
    },
    getOwnPropertyDescriptor(_target, prop: string) {
      const val = getRuleCategoryDictionaryGroup()[prop];
      if (val !== undefined) {
        return { configurable: true, enumerable: true, value: val };
      }
      return undefined;
    }
  });
