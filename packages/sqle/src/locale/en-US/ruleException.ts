// eslint-disable-next-line import/no-anonymous-default-export
export default {
  quickAdd: {
    conflict: 'This rule exception already exists'
  },
  tag: {
    exempted: 'Exempted',
    sqlExemption: 'Audit SQL exception'
  },
  report: {
    fullSqlExempted: 'Full SQL exempted'
  },
  button: {
    add: 'Add to audit SQL exception'
  },
  skippedSection: {
    title: 'Exempted rules',
    rule: 'Rule',
    level: 'Level',
    createdBy: 'Added by',
    createdAt: 'Added at',
    reason: 'Remark',
    action: 'Actions',
    viewDetail: 'View exception detail',
    viewAudit: 'View audit log',
    fullSqlRule: 'Full SQL exception'
  },
  matchConditionsSummary: {
    empty: '-',
    item: '{{type}}: {{content}}'
  },
  matchType: {
    sql: 'SQL keyword',
    fingerPrint: 'SQL fingerprint',
    ip: 'IP',
    cidr: 'Subnet (CIDR)',
    host: 'Host',
    instance: 'DB instance',
    db_user: 'DB user',
    db_type: 'DB type',
    audit_task_type: 'Scan task type',
    audit_task_id: 'Scan task',
    sql_source: 'Source',
    sqlSource: {
      sql_audit_record: 'Quick audit',
      audit_plan: 'Scan task'
    }
  },
  ruleScope: {
    all: 'All rules',
    specific: '{{count}} specific rule(s)'
  },
  detail: {
    title: 'SQL management rule exception detail',
    ruleScope: 'Rule scope',
    reason: 'Remark',
    createdBy: 'Added by',
    createdAt: 'Added at',
    matchedCount: 'Matched count',
    lastMatchTime: 'Last matched at'
  },
  form: {
    addCondition: 'Add condition',
    matchModeTips:
      'In this project, SQL that meets all of the following conditions will skip partial or all rule audits based on the effective scope.',
    ruleScopeModeTips:
      'In this project, SQL that meets the match conditions above will skip partial or all rule audits based on the effective scope.',
    ruleScopeMode: 'Rule scope',
    ruleScopeAll: 'All rules',
    ruleScopeSpecific: 'Specific rules',
    selectDbType: 'Database type',
    selectRules: 'Select rules',
    selectDbTypeFirst: 'Select a database type first',
    ruleScopeSearchPlaceholder: 'Search by rule name or description',
    ruleScopeLoadFailed: 'Failed to load rules',
    triggeredRules: 'Triggered rules',
    otherRules: 'Other rules',
    reason: 'Remark',
    matchRowErrorPrefix: 'Row {{index}}: ',
    validation: {
      atLeastOneRow: 'Add at least one match mode',
      duplicateRow: 'Duplicate match type and content',
      incompleteRow: 'Complete the type and content for each match row',
      summaryTitle: 'Please fix the following issues before submitting'
    }
  },
  table: {
    matchMode: 'Match mode',
    ruleScope: 'Rule scope',
    reason: 'Remark',
    createdBy: 'Added by',
    createdAt: 'Added at'
  },
  filter: {
    matchType: 'Match type',
    ruleScopeMode: 'Rule scope mode',
    ruleName: 'Rule name',
    auditTaskType: 'Scan task type',
    auditTask: 'Scan task',
    auditTaskId: 'Scan task',
    sqlSource: 'Source',
    createdBy: 'Added by',
    createdAt: 'Added at'
  }
};
