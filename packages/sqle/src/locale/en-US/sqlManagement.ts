// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL management',
  pageHeader: {
    action: {
      export: 'Export',
      exporting: 'Exporting file',
      exportSuccessTips: 'Export file successfully',
      exportFormatModal: {
        title: 'Select export file format'
      }
    }
  },
  statistics: {
    SQLTotalNum: 'SQL total',
    problemSQlNum: 'Problem SQL',
    optimizedSQLNum: 'Optimized SQL'
  },
  abnormalAuditPlanTips:
    'SQL collection has issues. To ensure SQL control functions properly, please diagnose and troubleshoot promptly.',
  scannerWillExpiredTips:
    'The scanner token will expire on {{date}}. To ensure SQL control functions properly, please reset and update the token promptly.',
  scannerExpiredTips:
    'The scanner token has expired. To ensure SQL control functions properly, please reset and update the token promptly.',
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
        ignoreSuccessTips: 'Ignored SQLs successfully in batch',
        pushToCoding: 'Push to external platform'
      },
      single: {
        assignment: 'Assign person in charge',
        assignmentSuccessTips: 'Assigned person in charge successfully',
        updatePriority: {
          triggerText: 'Change Priority',
          successTips: 'Successfully changed SQL priority',
          label: 'Change priority to',
          high: 'High Priority',
          low: 'Low Priority'
        },
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
      createWhitelist: 'Add to audit whitelist',
      pushToCodingForm: {
        project: 'Push to specified project',
        type: 'Push type',
        typeOptions: {
          defect: 'Defect',
          requirement: 'Requirement',
          mission: 'Task',
          epic: 'Epic',
          subTask: 'Sub-task'
        },
        urgency: 'Urgency',
        urgencyOptions: {
          low: 'Low',
          medium: 'Medium',
          high: 'High',
          emergency: 'Urgent'
        },
        successTips: 'Pushed to external platform successfully'
      }
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
        manual_audited: 'Manual audited',
        sent: 'Pushed to external platform'
      },
      business: 'Business',
      environmentAttribute: 'Environment attribute',
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
