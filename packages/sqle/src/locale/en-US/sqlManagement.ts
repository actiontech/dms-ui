// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL management',
  pageHeader: {
    action: {
      export: 'Export',
      exporting: 'Exporting file',
      exportSuccessTips: 'Export file successfully'
    }
  },
  statistics: {
    SQLTotalNum: 'SQL total',
    problemSQlNum: 'Problem SQL',
    optimizedSQLNum: 'Optimized SQL'
  },
  ceTips:
    'SQL management provides full lifecycle monitoring for users. The panel integrates all business SQLs, where users can view all SQLs collected and audited in the project, expose the problem SQLs, and support users to solve them.',
  table: {
    action: {
      batch: {
        assignment: 'Assign in batch',
        assignmentSuccessTips:
          'Assigned person in charge successfully in batch',
        solve: 'Solve in batch',
        solveTips: 'Are you sure to set the selected SQLs as solved?',
        solveSuccessTips: 'Solved SQLs successfully in batch',
        ignore: 'Ignore in batch',
        ignoreTips: 'Are you sure to set the selected SQLs as ignored?',
        ignoreSuccessTips: 'Ignored SQLs successfully in batch'
      },
      single: {
        assignment: 'Assign person in charge',
        assignmentSuccessTips: 'Assigned person in charge successfully',
        updateStatus: {
          triggerText: 'Change status',
          label: 'Current SQL status',
          solve: 'Solve',
          ignore: 'Ignore',
          manualAudit: 'Manual audit',
          signalUpdateStatusSuccessTips: 'Updated SQL status successfully'
        }
      },
      analyze: 'Analyze',
      createSqlManagementException: 'Add to SQL management whitelist',
      createWhitelist: 'Add to audit whitelist'
    },
    column: {
      SQLFingerprint: 'SQL fingerprint',
      source: 'Source',
      instanceName: 'DB instance',
      priority: 'Priority',
      highPriority: 'High priority',
      lowPriority: 'Low priority',
      auditResult: 'Audit result',
      firstOccurrence: 'First occurrence time',
      lastOccurrence: 'Last occurrence time',
      occurrenceCount: 'Occurrence count',
      personInCharge: 'Person in charge',
      status: 'Status',
      comment: 'Comment',
      endpoints: 'Endpoint info'
    },
    filter: {
      time: 'Time range',
      status: {
        unhandled: 'Unhandled',
        solved: 'Solved',
        ignored: 'Ignored',
        manual_audited: 'Manual audited'
      },
      business: 'Business',
      instanceName: 'DB instance',
      source: {
        label: 'Source',
        auditPlan: 'Scan task',
        defaultAuditPlan: 'Scan task default type',
        apiAudit: 'SQL audit'
      },
      auditLevel: {
        label: 'Minimum audit level',
        normal: 'Normal',
        error: 'Error',
        warn: 'Warning',
        notice: 'Notice'
      },
      assignee: 'Related to me',
      viewHighPrioritySql: 'View high priority SQL',
      rule: 'Audit rule'
    },
    statusReport: {
      title: 'SQL audit result'
    }
  }
};
