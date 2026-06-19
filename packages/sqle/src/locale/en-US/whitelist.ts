// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Audit whitelist',
  pageDesc:
    'You can add some SQL statements here, which will not trigger any audit rules during auditing.',

  ceTips:
    "If a user enables a rule but wants to temporarily bypass the triggering of certain rules in actual use, they can enable the platform'S audit whitelist feature.\nCurrently, it supports string matching or SQL fingerprint matching. Statements added to the SQL audit whitelist will not be subject to audit rules when creating a workflow request.",
  allWhitelist: 'All audit whitelist statements',
  view: {
    sql: 'Whole SQL exception',
    rule: 'Rule exception'
  },
  table: {
    sql: 'SQL statement',
    desc: 'Audit whitelist description',
    matchType: 'Match mode',
    matchCount: 'Matched count',
    lastMatchedTime: 'The last matching time'
  },

  matchType: {
    exact: 'String matching',
    fingerPrint: 'SQL fingerprint matching'
  },

  operate: {
    addWhitelist: 'Add audit whitelist',

    deleting: 'Deleting audit whitelist item...',
    deleteSuccess: 'Successfully deleted audit whitelist item',
    confirmDelete: 'Confirm deleting this audit whitelist item?'
  },

  modal: {
    add: {
      title: 'Add audit whitelist',
      success: 'Add audit whitelist Successfully'
    },
    update: {
      title: 'Update audit whitelist',
      success: 'Update audit whitelist Successfully',
      tips: 'When the match type or match content is modified, the match count and last match time of this record will be reset.'
    },
    sql: 'SQL'
  },
  ruleException: {
    addAction: 'Add as rule exception',
    drawerTitle: 'Add rule exception',
    addSuccess: 'Rule exception added successfully',
    duplicateTips:
      'This rule exception already exists. No need to add it again.',
    cancelAction: 'Cancel exception',
    deleting: 'Canceling rule exception...',
    deleteSuccess: 'Rule exception canceled successfully',
    confirmCancel:
      'Confirm canceling this rule exception? The same tuple will trigger this rule again after cancellation.',
    project: 'Project',
    instance: 'Data source',
    sqlFingerprint: 'SQL fingerprint',
    ruleName: 'Rule name',
    ruleDesc: 'Rule description',
    ruleLevel: 'Original rule level',
    reason: 'Reason',
    createdBy: 'Added by',
    createdAt: 'Added at',
    matchInfo: 'Hit information',
    matchInfoWithTime: 'Hit {{count}} times, last hit {{time}}',
    audit: 'Action',
    viewAudit: 'View audit',
    missingSqlFingerprint:
      'The current audit result does not return a SQL fingerprint, so rule exception cannot be added yet.',
    skippedModule: {
      title: 'Excepted rules',
      empty: 'No excepted rules in this audit result'
    }
  }
};
