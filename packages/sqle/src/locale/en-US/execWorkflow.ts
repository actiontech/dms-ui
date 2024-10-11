// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    pageTitle: 'Workflow list',
    pageDesc: 'The workflow list only displays workflows related to you.',

    allWorkflowAboutMe: 'All workflows related to me',
    workflowStatus: {
      review: 'Pending audit',
      exec: 'Pending execution'
    },
    batchClose: {
      buttonText: 'Batch close',
      closePopTitle: 'Are you sure you want to close the selected workflows?',
      messageWarn:
        'The workflows you selected contain workflows that cannot be closed! (only workflows with status “{{process}}” and “{{reject}}” can be closed.)'
    },

    exportWorkflow: {
      buttonText: 'Export workflows',
      exporting: 'Exporting historical workflows',
      exportSuccessTips: 'Historical workflows export successful'
    },

    createButtonText: 'Create workflow',

    name: 'Workflow name',
    dataSource: 'DB instance',
    schema: 'Database',
    schemaPlaceholder: 'Select database (optional)',
    createUser: 'Creator',
    assignee: 'Assignee',
    createTime: 'Create time',
    executeTime: 'Execution time',
    desc: 'Workflow description',
    status: 'Workflow status',
    time: 'Scheduled time',
    stepType: 'Current step type',
    sqlTaskStatus: 'Sql audit status',
    instanceName: 'DB instance',
    passRate: 'Audit pass rate',
    taskScore: 'Audit score',
    id: 'Workflow id',
    version: 'Version'
  },
  create: {
    backToList: 'Back to workflow list',
    title: 'Create workflow',
    currentVersion: 'Current version',
    mustAuditTips: 'You must audit your SQL before creating a workflow',
    mustHaveAuditResultTips:
      'You cannot create a workflow for SQL with empty audit results',

    form: {
      baseInfo: {
        title: 'Basic workflow information',

        name: 'Workflow name',
        workflowNameRule:
          'Can only contain letters, numbers, Chinese, hyphens and underscores',
        describe: 'Workflow description',
        describePlaceholder: 'Click to add workflow description (optional)'
      },

      sqlInfo: {
        title: 'Audit SQL statement information',

        isSameSqlForAll: 'Select the same SQL',
        tipsDataSourceTypeForSameSql:
          'You can only use the same SQL mode when the data source types are the same',
        sameSql: 'Same SQL',
        differenceSql: 'Different SQL',

        instanceName: 'DB instance',

        instanceNameTips:
          'The data source workflow template added later is the same as the current data source',
        instanceSchema: 'Database',
        schemaPlaceholder: 'Select database (optional)',

        sql: 'SQL statement',
        sqlFile: 'SQL file',
        sqlFileTips: 'Click to select a SQL file or drag the file to this area',
        mybatisFile: 'Mybatis XML file',
        mybatisFileTips:
          'Click to select an XML file or drag the file to this area',
        zipFile: 'Zip file',
        zipFileTips:
          'Click to select a zip file or drag the file to this area, currently only supports SQL auditing of .xml and .sql files in the ZIP file',

        addInstanceTips: 'Please add DB instance',
        addInstance: 'Add DB instance',
        uploadType: 'Select SQL statement upload method',
        manualInput: 'Enter SQL statement',
        uploadFile: 'Upload SQL file',
        updateMybatisFile: 'Upload Mybatis XML file',
        uploadZipFile: 'Upload ZIP file',

        audit: 'Audit',
        analyze: 'SQL analysis',
        format: 'SQL format',
        formatTips:
          'Currently, the supported database types for SQL formatting are {{supportType}}. if you have not selected a data source or the selected data source type is not yet supported, SQL formatting may result in SQL statement syntax errors.',

        selectExecuteMode: 'Select execution mode',
        selectExecuteModeTips:
          'When choosing file mode execution, audit results will be aggregated by file',
        execModeDisabledTips:
          'Currently supports MySQL, Oracle, PG type data sources to be executed in file mode',
        executeSqlMode: 'SQL mode',
        executeFileMode: 'File mode',
        selectFileSortMethod: 'Select file sorting method'
      },
      tour: {
        modifyName: 'Modify workflow name',
        modifyDataSource: 'Modify DB instance'
      }
    },

    auditResult: {
      clearDuplicate: 'Data deduplication',
      allLevel: 'All levels',
      submit: 'Submit workflow',
      updateInfo: 'Update workflow',
      disabledOperatorWorkflowBtnTips:
        'Project {{currentProject}} can only allow a maximum of {{allowAuditLevel}} level audit errors when creating workflows, but the current audit results contain a maximum of {{currentAuditLevel}} level audit results.',
      mustHaveAuditResultTips:
        'You cannot create a workflow for SQL with empty audit results',
      leaveTip:
        'Do you want to leave this page? the current workflow has not been submitted!'
    },
    createResult: {
      success: 'Workflow created successfully',
      guide: 'View the newly created workflow',
      cloneWorkflow: 'Clone workflow',
      viewWorkflowDetail: 'View workflow details'
    }
  },

  detail: {
    operator: {
      buttonText: 'Workflow details',
      title: 'Workflow information',
      baseInfo: {
        title: 'Basic information',
        createUser: 'Creator',
        createTime: 'Create time',
        status: 'Workflow status'
      },
      history: {
        title: 'Workflow operation history'
      },
      stepsTitle: 'Workflow progress',
      time: 'Operation time',
      user: 'Operator',
      reject: 'Reject',
      rejectFull: 'Reject all',
      markManually: 'Mark as manual execution',
      markManuallyConfirmTips:
        'This operation only changes the workflow status, but does not operate on the data source, do you confirm to mark it as manual execution?',
      rejectTips:
        'When the workflow is rejected, the workflow creator needs to modify it and then resubmit it for audit.',
      wait: 'Waiting for user {{username}} to operate',
      waitAudit: 'Waiting for the auditor to operate',
      notArrival: 'Waiting for the previous step to execute',
      rejectDetail:
        '{{name}} rejected the current workflow, the reason for the rejection is: ',
      alreadyRejected: 'The workflow has been rejected',
      alreadyClosed: 'The workflow has been closed',
      modifySql: 'Modify audit statement',
      updateEmptyWorkflowTips:
        'You cannot update the current workflow with SQL that has empty audit results',
      waitModifySql:
        'Waiting for user {{username}} to modify the audit statement',
      batchSqlExecute: 'Batch immediate execution',
      batchSqlExecuteConfirmTips:
        'This operation will immediately execute all SQL statements under the workflow, and the data sources that have been scheduled for timed execution will still be executed at the scheduled time and will not be executed immediately, do you confirm to execute immediately in batch?',
      sqlReview: 'Audit passed',
      terminate: 'Terminate execution',
      terminateSuccessTips: 'Terminate execution successful',
      terminateConfirmTips:
        'This operation will interrupt the current execution operation and roll back the SQL that is currently being executed, do you confirm to terminate execution?',
      unknown: 'Unknown step',
      refreshWorkflow: 'Refresh workflow',
      backToDetail: 'Back to workflow details',

      maintenanceTime:
        'The scheduled execution time must be within the maintenance time, the current data source maintenance time is: \n',
      sqlExecuteDisableTips:
        'You can only execute immediate execution within the maintenance time, the current data source maintenance time is',
      emptyMaintenanceTime: 'Any time',
      scheduleTime: 'Scheduled execution time',
      scheduleTimeExecuteConfirmLabel:
        'Send notification for confirmation before execution',
      scheduleTimeExecuteConfirmTips:
        'If enabled, when the scheduled execution time arrives, the platform will send a notification for confirmation of execution, the execution operation will be performed after confirmation; if disabled, the execution operation will be performed automatically when the scheduled execution time arrives',
      scheduleTimeExecuteConfirmMethod: 'Confirmation method',
      scheduleTimeExecuteConfirmMethodTips:
        'Currently only supports enterprise WeChat and Feishu, if you have not configured the corresponding process docking capability, please first go to <0>system settings-process docking</0> to enable it',
      confirmMethodWechat: 'Enterprise WeChat',
      confirmMethodFeishu: 'Feishu',

      approveSuccessTips: 'Approval passed',
      rejectSuccessTips: 'Rejected successfully',
      completeSuccessTips:
        'Synchronous workflow has been successfully executed',
      rejectReason: 'Reason for rejection',
      rejectAllTips:
        'This operation will reject all SQL statements under the workflow, please operate cautiously!',
      onlineRegularly: 'Scheduled execution',
      execScheduledErrorMessage:
        'The scheduled execution time must be within the maintenance time',
      execScheduledBeforeNow:
        'The scheduled execution time must be after the current time',
      execScheduleTips: 'Scheduled execution setting successful',
      status: 'Execution status',
      executingTips: 'Immediate execution setting successful',
      createWorkflowStep: 'Create workflow',
      updateWorkflowStep: 'Update workflow',
      reviewWorkflowStep: 'Audit workflow',
      executeWorkflowStep: 'Execute workflow',
      stepNumberIsUndefined:
        'The step number of the current node is undefined!',
      closeWorkflow: 'Close workflow',
      closeConfirm: 'Are you sure you want to close the current workflow?',
      closeWorkflowSuccessTips: 'Workflow closed successfully',
      cloneExecWorkflow: 'Execute to another instance',
      associatedWorkflowInfo: 'Associated workflows'
    },

    paginationDisplay: 'Pagination display',
    waterfallDisplay: 'Waterfall display',
    overview: {
      title: 'Overview',
      table: {
        instanceName: 'DB instance',
        status: 'Status',
        execStartTime: 'Execution start time',
        execEndTime: 'Execution end time',
        scheduleExecuteTime: 'Scheduled execution time',
        assigneeUserName: 'Assignee',
        executeUserName: 'Executor',
        passRate: 'Audit pass rate',
        score: 'Audit score',
        operator: 'Operation',
        sqlExecute: 'Immediate execution',
        scheduleTime: 'Scheduled execution',
        cancelExecScheduled: 'Cancel scheduled execution',
        cancelExecScheduledTips: 'Cancel scheduled execution successful',
        sqlExecuteConfirmTips:
          'This operation will immediately execute the SQL statements on the data source, do you confirm to execute immediately?'
      }
    },
    taskResult: {}
  },

  audit: {
    result: 'Audit result',
    passRage: 'Audit pass rate',
    source: 'Audit score',
    duplicate: 'Deduplication',
    downloadSql: 'Download SQL statement',
    downloadReport: 'Download audit report',
    table: {
      number: 'Serial number',
      auditLevel: 'Rule level',
      auditStatus: 'Audit status',
      auditResult: 'Audit result',
      execSql: 'Execution statement',
      execStatus: 'Execution status',
      execResult: 'Execution result',
      rollback: 'Rollback statement',
      rollbackTips: 'Only prompt, does not support rollback execution',
      describe: 'Description',
      analyze: 'Analysis',
      addDescribe: 'Add description',
      createWhitelist: 'Add to SQL management whitelist'
    },

    filterForm: {
      highestAuditLevel: 'Highest audit warning level'
    },

    sqlFileSource: {
      tips: 'Currently only supports viewing the SQL source in SQL/ZIP files',
      source: 'Source file',
      fileLine: 'Line number'
    },

    auditStatus: {
      initialized: 'Ready for audit',
      doing: 'Auditing',
      finished: 'Audit completed'
    },
    copyExecSql: 'Copy execution statement',
    auditSuccess: 'Audit passed',

    fileModeExecute: {
      headerTitle: 'File information overview',
      sqlsTips: 'Only the first 5 data items are displayed, <0>view more<0>',
      extraButtonText: 'Edit execution workflow',

      sortableSQLFilesModal: {
        title: 'Edit execution workflow',
        tips: 'Please drag the rows in the table to reorder the execution workflow of the SQL files.',
        resetFileOrder: 'Reset file workflow',
        tableColumns: {
          execOrder: 'Initial execution number',
          index: 'Execution number after sorting',
          fileName: 'File',
          hasDragged: 'Whether the workflow has been changed'
        },
        successTips: 'Sorting successful!'
      }
    },

    fileModeSqls: {
      backToDetail: 'Back to workflow details',
      title: 'File information details',

      statistics: {
        audit: 'Audit result information',
        execute: 'Execution result information'
      }
    }
  },

  common: {
    workflowStatus: {
      process: 'Processing',
      canceled: 'Closed',
      executing: 'Executing',
      execFailed: 'Execution failed',
      waitForAudit: 'Pending audit',
      waitForExecution: 'Pending execution',
      reject: 'Rejected',
      execScheduled: 'Scheduled execution',
      execSucceeded: 'Execution successful',
      manuallyExecuted: 'Manual execution',
      terminateFailed: 'Termination failed',
      terminateSucceeded: 'Termination successful',
      terminating: 'Terminating'
    },
    execStatus: {
      initialized: 'Ready for execution',
      doing: 'Executing',
      succeeded: 'Execution successful',
      failed: 'Execution failed',
      manually_executed: 'Manual execution',
      terminate_fail: 'Termination failed',
      terminate_succ: 'Termination successful',
      terminating: 'Terminating',
      allStatus: 'All statuses'
    }
  }
};
