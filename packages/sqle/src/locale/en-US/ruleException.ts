// eslint-disable-next-line import/no-anonymous-default-export
export default {
  quickAdd: {
    title: 'Add as exception',
    description:
      'The current SQL fingerprint, data source, and scan task will be matched automatically. Only the selected rule will be exempted.',
    reason: 'Remark',
    missingDbType: 'Database type is required to add a rule exception',
    success: 'Rule exception added successfully',
    conflict: 'This rule exception already exists',
    viewExisting: 'View existing exception',
    context: {
      title: 'Exception match scope',
      db_type: 'Database type',
      audit_task_type: 'Scan task type',
      audit_task_name: 'Scan task name',
      fingerPrint: 'SQL fingerprint',
      rule_scope: 'Rule scope (rules)'
    }
  },
  cancel: {
    title: 'Remove exception',
    confirm: 'Remove the exception for this rule?',
    success: 'Rule exception removed successfully',
    disabledTip: 'Cannot remove: related exception record not found'
  },
  tag: {
    exempted: 'Exempted'
  },
  button: {
    add: 'Add as exception'
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
    viewAudit: 'View audit log'
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
    audit_task_id: 'Scan task ID'
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
    ruleScopeMode: 'Rule scope',
    ruleScopeAll: 'All rules',
    ruleScopeSpecific: 'Specific rules',
    selectDbType: 'Database type',
    selectRules: 'Select rules',
    triggeredRules: 'Triggered rules',
    otherRules: 'Other rules',
    reason: 'Remark',
    matchRowErrorPrefix: 'Row {{index}}: ',
    validation: {
      atLeastOneRow: 'Add at least one match condition',
      missingPrimaryType:
        'Match conditions must include at least one primary type (SQL/SQL fingerprint/IP/CIDR/host/instance/DB user)',
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
    auditTaskId: 'Scan task ID',
    createdBy: 'Added by',
    createdAt: 'Added at'
  }
};
