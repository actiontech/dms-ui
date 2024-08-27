// eslint-disable-next-line import/no-anonymous-default-export
export default {
  result: 'Audit result',
  passRage: 'Audit pass rate',
  source: 'Audit score',
  duplicate: 'Deduplication',
  downloadSql: 'Download SQL statement',
  downloadReport: 'Download audit report',
  table: {
    number: 'No.',
    auditLevel: 'Rule level',
    auditStatus: 'Audit status',
    auditResult: 'Audit result',
    execSql: 'Execute statement',
    execStatus: 'Execute status',
    execResult: 'Execute result',
    rollback: 'Rollback statement',
    rollbackTips: 'Only prompt, rollback is not supported',
    describe: 'Description',
    analyze: 'Analyze',
    addDescribe: 'Add description'
  },

  filterForm: {
    highestAuditLevel: 'Highest audit warning level'
  },

  sqlFileSource: {
    tips: 'Currently only supports viewing SQL sources in SQL/ZIP files',
    source: 'Source file',
    fileLine: 'Line number'
  },

  execStatus: {
    initialized: 'Ready to execute',
    doing: 'Executing',
    succeeded: 'Execute success',
    failed: 'Execute failed',
    manually_executed: 'Manual execution',
    terminate_fail: 'Termination failed',
    terminate_succ: 'Termination success',
    terminating: 'Terminating',
    allStatus: 'All status'
  },

  auditStatus: {
    initialized: 'Ready to audit',
    doing: 'Auditing',
    finished: 'Audit completed'
  },
  copyExecSql: 'Copy execute statement',
  auditSuccess: 'Audit passed',

  fileModeExecute: {
    headerTitle: 'File information overview',
    sqlsTips: 'Only the first 5 data are displayed, <0>view more<0>'
  },
  fileModeSqls: {
    backToDetail: 'Return to workflow details',
    title: 'File information details',

    statistics: {
      audit: 'Audit result information',
      execute: 'Execute result information'
    }
  }
};
