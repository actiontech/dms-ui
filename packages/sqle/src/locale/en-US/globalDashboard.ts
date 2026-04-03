// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Dashboard',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  tab: {
    workflow: 'Workflow',
    sqlGovernance: 'SQL Governance',
    account: 'Account Management'
  },
  common: {
    missingProject: 'Missing project information. Cannot navigate.'
  },
  workflow: {
    action: {
      viewDetail: 'View'
    },
    card: {
      pendingMine: 'Pending Mine',
      pendingMineSubtitle: 'Action required',
      initiated: 'Initiated By Me',
      initiatedSubtitle: 'Track progress',
      archived: 'Archived',
      archivedSubtitle: 'Completed tasks'
    },
    column: {
      name: 'Workflow Name',
      type: 'Type',
      project: 'Project',
      instance: 'Instance',
      assignee: 'Assignee',
      priority: 'Priority',
      status: 'Status'
    },
    status: 'Workflow Status',
    name: 'Workflow Name',
    desc: 'Workflow Description',
    createTime: 'Create Time',
    statusLabel: {
      pending_approval: 'Pending Approval',
      pending_action: 'Pending Action',
      in_progress: 'In Progress',
      exporting: 'Exporting',
      rejected: 'Rejected',
      cancelled: 'Cancelled',
      failed: 'Failed',
      completed: 'Completed',
      unknown: 'Unknown'
    },
    workflowTypeLabel: {
      sql_release: 'SQL Release Workflow',
      data_export: 'Data Export Workflow'
    },
    filter: {
      workflowType: 'Workflow type'
    },
    toolbar: {
      searchPlaceholder: 'Search by workflow title or ID'
    }
  },
  sql: {
    card: {
      pending: 'Pending SQL',
      pendingSubtitle: 'SQL requiring adjustment',
      optimized: 'Optimized',
      optimizedSubtitle: 'Optimized SQL'
    },
    column: {
      sqlFingerprint: 'SQL Fingerprint',
      suggestion: 'Suggestion',
      source: 'Source',
      project: 'Project',
      instance: 'Instance',
      lastSeenAt: 'Last Seen',
      status: 'Status',
      action: 'Action',
      avgTime: 'Avg {{value}}s',
      execCount: 'Count {{value}}'
    },
    taskStatus: {
      unhandled: 'Pending',
      solved: 'Optimized',
      ignored: 'Ignored',
      manual_audited: 'Manual review',
      sent: 'Assigned'
    },
    action: {
      optimize: 'Optimize',
      detail: 'Detail'
    },
    toolbar: {
      searchPlaceholder: 'Search SQL fingerprint, suggestion, or source'
    }
  },
  pendingSql: {
    title: 'Pending SQL',
    column: {
      desc: 'Description',
      source: 'Source',
      status: 'Status',
      firstAppearTime: 'First Appear Time',
      instance: 'Instance',
      project: 'Project',
      projectPriority: 'Project Priority',
      detail: 'Detail'
    },
    ceTips:
      'The pending SQL panel will integrate the SQL identified as problems in SQL control. If you need to centrally track the progress of problem SQL resolution, you can access it globally in the pending SQL panel.'
  },
  pendingExportWorkflow: {
    title: 'Export Workflow',
    ceTips:
      'This panel aggregates pending data export workflows for centralized processing.',
    column: {
      status: 'Status',
      name: 'Workflow Name',
      desc: 'Description',
      createTime: 'Create Time',
      instance: 'Instance',
      viewWorkflowDetail: 'View Workflow Detail',
      project: 'Project',
      projectPriority: 'Project Priority'
    },
    status: {
      canceled: 'Canceled',
      exporting: 'Exporting',
      finished: 'Finished',
      failed: 'Failed',
      rejected: 'Rejected',
      waiting_for_export: 'Waiting For Export',
      wait_for_approve: 'Waiting For Approve'
    }
  },
  pendingWorkOrder: 'Pending Work Order',
  onlineWorkOrder: 'Online Work Order',
  exportWorkOrder: 'Export Work Order',
  initiatedWorkOrder: 'Initiated Work Order',
  pendingMyAction: 'Pending My Action',
  account: {
    card: {
      expiringSoon: 'Expiring Soon',
      expiringSoonSubtitle: 'Please renew soon',
      active: 'Total Active Accounts',
      activeSubtitle: 'Status normal',
      myActive: 'My Active Accounts',
      myActiveSubtitle: 'Status normal'
    },
    column: {
      accountName: 'Account Name',
      project: 'Project',
      instance: 'Database',
      creator: 'Creator',
      expiredTime: 'Expire Time',
      status: 'Status',
      action: 'Action'
    },
    expireDaysRemaining: '{{count}} days left',
    expireDaysOverdue: 'Expired {{count}} days ago',
    statusValue: {
      active: 'Active',
      expiring: 'Expiring',
      expired: 'Expired',
      locked: 'Locked'
    },
    action: {
      renew: 'Renew',
      applyRenew: 'Apply Renew',
      recycle: 'Recycle',
      logout: 'Logout',
      detail: 'Detail'
    },
    confirm: {
      recycle: 'Recycle this account?',
      logout: 'Deactivate this account?'
    }
  },
  filter: {
    project: 'Project',
    instance: 'Instance'
  }
};
