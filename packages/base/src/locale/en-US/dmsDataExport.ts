// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Data export',
  ceTips:
    'When you do not have permission to view a certain DB instance, but need to export data from it, you can use the data export function. by going through the approval process, you can get the corresponding data. this way, even without direct viewing permission, you can still get the data you need.',
  status: {
    wait_for_audit: 'Pending audit',
    wait_for_export: 'Pending export',
    finished: 'Export success',
    exporting: 'Exporting',
    export_failed: 'Export failed',
    expired: 'Expired',
    rejected: 'Rejected',
    canceled: 'Closed',
    file_deleted: 'Removed'
  },
  batchCancel: {
    messageWarn:
      'The tasks you selected contain tasks that cannot be closed! (only tasks with status "{{waitAudit}}" and "{{reject}}" can be closed.)'
  },
  create: {
    backToList: 'Back to task list',
    button: 'Create export',
    form: {
      base: {
        title: 'Create export task',
        name: 'Data export task name',
        describe: 'Task description',
        describePlaceholder: 'Click to add data export description'
      },
      source: {
        title: 'Select export target',
        business: 'Business type',
        dbService: 'DB instance',
        schema: 'Database'
      },
      method: {
        title: 'Select export method',
        manualInput: 'Input sql statement'
      },
      action: {
        audit: 'Audit',
        format: 'Sql beautify',
        formatTips:
          'Currently, the database types that support sql beautify are {{supportType}}. if no DB instance is selected or the selected DB instance type is not yet supported, sql beautify may lead to syntax errors in the sql statement.'
      }
    },
    update: {
      baseTitle: 'Task basic info',
      sourceTitle: 'Task export target',
      methodTitle: 'Export method',
      updateInfoAction: 'Modify task',
      submitAction: 'Submit task',
      submitTips: 'Only supports creating export tasks for dql statements'
    },
    result: {
      success: 'Task created successfully',
      guide: 'View the newly created task'
    }
  },
  batchClose: {
    button: 'Batch close',
    tips: 'Are you sure you want to close the selected export tasks?'
  },
  list: {
    column: {
      id: 'Task id',
      name: 'Task name',
      dbService: 'DB instance',
      desc: 'Description',
      exportMethod: 'Export method',
      createUser: 'Creator',
      createTime: 'Create time',
      exportTime: 'Export time',
      status: 'Status',
      assignee: 'Assignee',
      viewOrderDetail: 'View task detail'
    },
    actions: {
      closed: 'Close',
      closeTips: 'Are you sure you want to close the task "{{name}}"? '
    }
  },
  detail: {
    reject: {
      reason: '{{name}} rejected the current task, the reason is:',
      tips: 'When the task is rejected, the task creator needs to modify it and resubmit it for review. (currently, modifying the task is not supported.)'
    },
    exportResult: {
      title: 'Export result',
      overview: {
        title: 'Overview',
        column: {
          dbService: 'DB instance',
          status: 'Status',
          assigneeUser: 'Assignee',
          exportStartTime: 'Export start time',
          exportEndTime: 'Export end time',
          exportType: 'Export method',
          exportFileType: 'Export file type',
          action: {
            download: 'Download data',
            downloadTips:
              'Please download the dataset within 24 hours. if it expires, you will need to resubmit the task.'
          }
        }
      },
      taskDetail: {
        copy: 'Copy sql statement',
        exportContent: 'Export content',
        exportFileType: 'Export format',
        auditResult: 'Audit result',
        exportResult: 'Export result',
        downloadSQL: 'Download sql statement'
      }
    },
    record: {
      title: 'Task info',
      basicInfo: {
        title: 'Basic info',
        createUser: 'Creator',
        createTime: 'Create time',
        status: 'Status'
      },
      steps: {
        title: 'Task progress',
        create: 'Create task',
        update: 'Update task',
        approve: 'Audit task',
        execute: 'Execute export'
      },
      history: {
        title: 'Task operation record'
      }
    },
    action: {
      workflowDetail: 'Task detail',
      close: {
        text: 'Close task',
        successTips: 'Task closed successfully!'
      },
      approve: {
        text: 'Approve',
        successTips: 'Task approved successfully!'
      },
      reject: {
        modal: {
          title: 'Reject',
          text: 'Reject'
        },
        reason: 'Reject reason',
        text: 'Reject audit',
        tips: 'The current operation will reject all export tasks under the task. please operate with caution!',
        successTips: 'Task rejected successfully!'
      },
      execute: {
        text: 'Execute export',
        successTips: 'Task executed successfully!',
        confirmTips:
          'The current operation will immediately execute all tasks under the export task. do you confirm to execute export immediately?'
      }
    },
    operator: {
      unknown: 'Unknown step',
      waitAudit: 'Waiting for auditor operation',
      alreadyRejected: 'Task has been rejected',
      alreadyClosed: 'Task has been closed'
    }
  },
  common: {
    auditResult: {
      column: {
        number: 'No.',
        execSql: 'Execute statement',
        sqlType: 'Statement type',
        auditResult: 'Audit result'
      }
    }
  }
};
