// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Data export',
  ceTips:
    'When you do not have permission to view a certain DB instance, but need to export data from it, you can use the data export function. by going through the approval process, you can get the corresponding data. this way, even without direct viewing permission, you can still get the data you need.',
  status: {
    wait_for_audit: 'Pending audit',
    wait_for_masking_approve: 'Pending masking approval',
    partial_failed: 'Partial export failed',
    wait_for_export: 'Pending export',
    finished: 'Export success',
    exporting: 'Exporting',
    export_failed: 'Export failed',
    expired: 'Expired',
    rejected: 'Rejected',
    canceled: 'Closed',
    file_deleted: 'Removed'
  },
  failStage: {
    task_schedule: 'Task scheduling',
    connect: 'Data source connection',
    prepare: 'Export preparation',
    sql_execute: 'SQL execution',
    file_generate: 'File generation',
    unknown: 'Unknown'
  },
  execStatus: {
    success: 'Success',
    failed: 'Failed',
    not_executed: 'Not executed',
    notExecutedHint:
      'The export task has failed; this SQL statement was not executed'
  },
  batchCancel: {
    messageWarn:
      'The workflows you selected contain workflows that cannot be closed! (only workflows with status "{{waitAudit}}" and "{{reject}}" can be closed.)'
  },
  create: {
    backToList: 'Back to workflow list',
    button: 'Create export',
    form: {
      base: {
        title: 'Create export workflow',
        name: 'Data export workflow name',
        describe: 'Workflow description',
        describePlaceholder: 'Click to add data export description',
        workflowTemplate: 'Approval workflow template',
        workflowTemplateTips:
          'When multiple templates exist, please select the approval flow for this export workflow',
        addOpsType: 'Add ops type',
        addOpsTypeSuccess: 'Ops type added successfully',
        updateOpsTypeSuccess: 'Ops type updated successfully',
        deleteOpsTypeSuccess: 'Ops type deleted successfully',
        deleteOpsTypeConfirm: 'Are you sure to delete this ops type?',
        deleteOpsTypeReferenced:
          'This ops type is referenced by workflows and cannot be deleted',
        emptyOpsTypeMemberTip:
          'Please contact the project admin to configure ops types'
      },
      source: {
        title: 'Select export target',
        titleTips: 'Data export supports MySQL/Oracle/PG/SQL Server only',
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
    submit: {
      buttonText: 'Submit workflow',
      onlySupportDDLSqls:
        'Only supports creating export workflows for DQL statements',
      hasExceptionRule:
        'There are unchecked audit exception rules. Please fix and re-audit first',
      continueSubmission: 'Create anyway',
      plaintextWarning:
        'Sensitive fields detected. You can choose "Export plaintext data" per SQL.',
      plaintextReasonPlaceholder:
        'Please explain the business reason for exporting plaintext data',
      plaintextReasonRequired:
        'Please select plaintext SQL statements and fill in the apply reason',
      plaintextApplyCreateFailed:
        'Export workflow created, but plaintext apply creation failed. Please verify in approvals later.',
      plaintextApplyCreateFailedWithDetail:
        'Export workflow created, but plaintext apply creation failed ({{count}} datasource(s) failed).',
      plaintextApplyCompensateGuide:
        'You can open the created workflow first, then complete or re-initiate plaintext approvals from approvals.',
      plaintextApplyCompensateAction: 'View created workflow'
    },
    approvalProcess: {
      title: 'Approval Process',
      hint: 'Approval process can be modified in Project Configure > Approval Process',
      stepLabel: 'Step {{number}}',
      matchByPermission: 'Match by Permission',
      loadFailed: 'Failed to load approval process',
      stepType: {
        export_review: 'Export Approval',
        export_execute: 'Export Execution Confirm'
      }
    },
    update: {
      baseTitle: 'Workflow basic info',
      sourceTitle: 'Workflow export target',
      methodTitle: 'Export method',
      updateInfoAction: 'Modify workflow'
    },
    result: {
      success: 'Workflow created successfully',
      guide: 'View the newly created workflow',
      alertTitle: 'After approval, please note the following:',
      exportTimeLimitTitle: '1. Export operation time limit:',
      exportTimeLimitDesc:
        'The system will retain this export task for 24 hours.',
      fileDownloadLimitTitle: '2. File download time limit:',
      fileDownloadLimitDesc:
        'After the export file is generated, the file itself is also retained for 24 hours only.',
      reminder:
        'To ensure you can obtain the file smoothly, please check the approval result promptly and complete the export and file download immediately.'
    }
  },
  batchClose: {
    button: 'Batch close',
    tips: 'Are you sure you want to close the selected export workflows?'
  },
  list: {
    column: {
      id: 'Workflow ID',
      name: 'Workflow name',
      dbService: 'DB instance',
      desc: 'Description',
      exportMethod: 'Export method',
      createUser: 'Creator',
      createTime: 'Create time',
      exportTime: 'Export time',
      status: 'Status',
      assignee: 'Assignee',
      workflowTemplate: 'Approval template',
      opsType: 'Ops type',
      plaintextExport: 'Plaintext export',
      viewOrderDetail: 'View workflow detail'
    },
    actions: {
      closed: 'Close',
      closeTips: 'Are you sure you want to close the task "{{name}}"? '
    }
  },
  detail: {
    reject: {
      reason: '{{name}} rejected the current workflow, approval comment:',
      tips: 'When the workflow is rejected, the workflow creator needs to modify it and resubmit it for audit. (currently, modifying the workflow is not supported.)'
    },
    exportResult: {
      title: 'Export result',
      overview: {
        title: 'Overview',
        plaintextNotice: {
          pending: {
            message: 'Plaintext export pending approval',
            description:
              'A plaintext export request has been submitted. Plaintext data will be downloadable after approval.',
            link: 'Go to approval page'
          },
          approved: {
            message: 'Plaintext export approved',
            description:
              'Please complete the download before {{deadline}}. Time remaining: {{remain}}.'
          },
          downloaded: {
            message: 'Plaintext data downloaded',
            description:
              'Current download credential expires at {{deadline}} ({{remain}} remaining). You can re-download within this window.'
          },
          rejected: {
            message: 'Plaintext export request rejected',
            description:
              'Please review the rejection details on the approval page and resubmit if needed.',
            link: 'View approval details'
          },
          postDownloadExpired: {
            message: 'Plaintext data downloaded successfully',
            description:
              'The 30-minute re-download window has closed. Submit a new request to download again.'
          },
          expired: {
            message: 'Plaintext export request expired',
            description:
              'The download window has expired. Submit a new plaintext export request to get the data.'
          }
        },
        partialFailedNotice:
          'This workflow is partially failed: successful tasks remain downloadable, failed tasks need retry after fixes.',
        column: {
          dbService: 'DB instance',
          status: 'Status',
          failStage: 'Failure stage:',
          failReason: 'Failure reason:',
          assigneeUser: 'Assignee',
          exportStartTime: 'Export start time',
          exportEndTime: 'Export end time',
          exportType: 'Export method',
          exportFileType: 'Export file type',
          action: {
            download: 'Download data',
            downloadOriginal: 'Download plaintext data',
            downloadTips:
              'Please download the dataset within 24 hours. if it expires, you will need to resubmit the workflow.',
            downloadOriginalFailed:
              'Failed to download plaintext data. Please try again later.'
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
      title: 'Workflow info',
      basicInfo: {
        title: 'Basic info',
        createUser: 'Creator',
        createTime: 'Create time',
        status: 'Status',
        exportFailSummaryLabel: 'Failure reason:',
        exportFailSummaryFallback:
          'Export failed. No specific reason is available yet; please contact the administrator to check service logs',
        exportMode: 'Export type',
        exportModePlaintext: 'Plaintext export',
        exportModeMasked: 'Masked export'
      },
      steps: {
        title: 'Workflow progress',
        create: 'Create workflow',
        update: 'Update workflow',
        approve: 'Audit workflow',
        execute: 'Execute export'
      },
      history: {
        title: 'Workflow operation record'
      }
    },
    action: {
      workflowDetail: 'Workflow detail',
      close: {
        text: 'Close workflow',
        successTips: 'Workflow closed successfully!'
      },
      approve: {
        text: 'Audit passed',
        successTips: 'Workflow audit passed successfully!'
      },
      reject: {
        modal: {
          title: 'Reject',
          text: 'Reject'
        },
        reason: 'Approval comment',
        text: 'Reject audit',
        tips: 'The current operation will reject all export tasks under the workflow. please operate with caution!',
        successTips: 'Workflow rejected successfully!'
      },
      execute: {
        text: 'Execute export',
        successTips: 'Task executed successfully!',
        confirmTips:
          'The current operation will immediately execute all tasks under the export workflow. do you confirm to execute export immediately?'
      }
    },
    operator: {
      unknown: 'Unknown step',
      waitAudit: 'Waiting for auditor operation',
      alreadyRejected: 'Workflow has been rejected',
      alreadyClosed: 'Workflow has been closed',
      approvalComment: 'Approval comment',
      notFilled: 'Not filled',
      confirmApprove: 'Confirm approval'
    }
  },
  common: {
    auditResult: {
      column: {
        number: 'No.',
        execSql: 'Execute statement',
        sqlType: 'Statement type',
        auditResult: 'Audit result',
        createWhitelist: 'Add to audit whitelist',
        exportPlaintext: 'Plaintext Export',
        exportPlaintextAction: 'Export plaintext data (requires approval)',
        snapshotInfo: 'Lineage/Masking Snapshot',
        maskingSnapshotCount: '{{count}} masked field(s)',
        lineageSnapshotCount: '{{count}} lineage source(s)',
        snapshotDetail: 'View details',
        maskingFields: 'Masked fields and rules',
        lineagePathPreview: 'Lineage path preview'
      }
    }
  }
};
