// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL console',
  pageDescribe:
    'You can perform audited SQL operations on DB instances that you have permission to access.',
  eeErrorTips:
    'SQL query is not configured in this environment. Please set it up before using it.',
  eeErrorTips2:
    'For configuration methods and usage instructions, please refer to the documentation.',
  jumpToCloudBeaver: 'Open SQL console',
  ceTips:
    'When you need fine-grained audit and logging of data operations generated by the SQL console, you can use the SQL console audit feature to ensure traceability and accountability of data operations.',
  statistic: {
    total: 'Total SQL executed',
    succeedTotal: 'Success rate',
    interceptedTotal: 'Abnormal SQL intercepted by audit',
    failedTotal: 'Failed SQL execution'
  },
  sqlAuditResult: 'SQL audit result',
  operationList: {
    exportButton: 'Export',
    exportTips: 'Exporting SQL operation records',
    column: {
      operationUser: 'Operator',
      operationTime: 'Operation time',
      service: 'DB instance',
      operationDetail: 'Operation detail',
      sessionId: 'Session ID',
      operationIP: 'Operation IP',
      auditResult: 'Audit result',
      execResult: 'Execution result',
      execTime: 'Execution time (ms)',
      rowCount: 'Result set row count'
    },
    createWhitelist: 'Add to audit whitelist'
  }
};
