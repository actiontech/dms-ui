// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Global DB instances',
  ceTips:
    'When you need to manage DB instances conveniently across projects, you can use the global DB instance overview function to efficiently understand the distribution and configuration of instances on projects.',
  list: {
    instanceName: 'DB instance name',
    projectName: 'Project name',
    address: 'Address',
    lastTestConnectionStatus: 'Last Connection Status',
    testConnectionStatusFilterLabel: 'Data Source Connection Status',
    describe: 'Description',
    role: 'Role',
    type: 'DB instance type',
    ruleTemplate: 'Template',
    workflow: 'Workflow',
    maintenanceTime: 'Maintenance time',
    source: 'Source',
    environmentAttribute: 'Environment Attribute',
    dataMask: 'Data mask',
    unfinishedWorkflowNum: 'Unfinished workflow count',
    workbenchQueryAudit: 'Workbench query log'
  },
  testConnectModal: {
    errorTitle: 'DB instance {{instanceName}} connectivity test failed'
  },
  deleteDatabase: {
    confirmMessage: 'Confirm delete DB instance "{{name}}"?',
    deletingDatabase: 'Deleting DB instance "{{name}}"...',
    deleteSuccessTips: 'Deleted DB instance "{{name}}" successfully'
  },
  batchTestConnection: {
    notFoundData: 'No data in the current list!',
    connectFailed: 'Connection failed',
    connectSucceed: 'Connection succeeded',
    batchTestConnectionSuccessTips:
      'Batch data source connectivity test succeeded!'
  },
  addDatabase: 'Add DB instance',
  batchTestDataSourceConnection: 'Batch Test Data Source Connectivity',
  backToList: 'Back to global DB instance list',
  batchImportDataSource: {
    buttonText: 'Batch import DB instances',
    title: 'Batch import DB instances',
    importFile: 'Import',
    successTitle: 'Batch import DB instances successfully',
    requestAuditErrorMessage:
      'The current import information has failed verification. please modify it according to the prompt in the downloaded file and import it again.',
    submitButton: 'Import'
  }
};
