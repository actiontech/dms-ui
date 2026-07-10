/** API response alias for scan task type in match_conditions */
export const MATCH_CONDITION_READ_TYPE_SOURCE = 'source' as const;

/** API response alias for scan task instance ID in match_conditions */
export const MATCH_CONDITION_READ_TYPE_SOURCE_ID = 'source_id' as const;

export const RULE_SCOPE_ALL_VALUE = 'ALL' as const;

export type RuleScopeWriteValue = typeof RULE_SCOPE_ALL_VALUE | string[];
