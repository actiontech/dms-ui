// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'DB instance',
  pageDesc:
    'You can register DB instances that need sql audit here, and choose whether to enable various functions for the DB instance.',

  databaseListTitle: 'DB instances list',

  databaseList: {
    instanceName: 'DB instance name',
    address: 'Address',
    describe: 'Describe',
    role: 'Role',
    type: 'DB instance type',
    enabledScanTypes: 'Enabled scan types',
    ruleTemplate: 'Template',
    workflow: 'Workflow',
    maintenanceTime: 'Maintenance time',
    source: 'Source',
    business: 'Business',
    dataMask: 'Data mask'
  },

  backDesc: 'Back to DB instances list',
  addDatabase: 'Add DB instance',
  addDatabaseSuccess: 'Add DB instance successfully',
  addDatabaseSuccessGuide:
    'Go to DB instances list to view the newly added DB instance',

  updateDatabase: {
    title: 'Edit DB instance',
    getDatabaseInfoError: 'Failed to get DB instance information',
    updateDatabase: 'Update DB instance',
    updateDatabaseSuccess: 'DB instance "{{name}}" updated successfully'
  },

  dataSourceForm: {
    baseConfig: 'Base configuration',
    sqlConfig: 'SQL audit configuration',
    name: 'DB instance name',
    describe: 'DB instance describe',
    type: 'DB instance type',
    ip: 'DB instance address',
    ipTips: 'DB instance IP or domain name',
    port: 'DB instance port',
    user: 'Connection user',
    password: 'Password',
    role: 'Accessible roles',
    project: 'Project',
    business: 'Business',
    ruleTemplate: 'Audit rule template',
    workflow: 'Applied workflow',
    maxPreQueryRows: 'SQL query return rows',
    queryTimeoutSecond: 'SQL timeout limit(s)',
    maintenanceTime: 'Maintenance time',
    maintenanceTimeTips:
      'After setting the maintenance time, workflows can only be executed during this maintenance time period',
    needAuditSqlService: 'Enable SQL audit service',
    closeAuditSqlServiceTips:
      'If you do not enable the SQL audit service, the DB instance cannot be used in SQL audit related services, are you sure to close it?',
    needAuditForSqlQuery: 'Whether SQL query needs audit',
    allowQueryWhenLessThanAuditLevel: 'Highest audit level for running queries',
    allowExecuteNonDqlInWorkflow:
      'Allow executing non-DQL SQL via workflow in SQL workbench',
    allowExecuteNonDqlInWorkflowTips:
      'When enabled, allows executing non-DQL SQL statements via workflow in SQL workbench',
    passwordTips:
      'The current DB instance password you have configured will not be displayed here. if you do not fill in the password when submitting, the DB instance password will not be changed.',
    needUpdatePassword: 'Update password',
    updatePassword: 'Update connection password',
    dataMaskConfig: 'Data mask configuration',
    dataMaskConfigLabel:
      'Whether to enable data mask configuration for SQL workbench',
    dataMaskConfigTips:
      'After enabling, the query results of the SQL workbench will be masked',
    checkDataMaskButton: 'View data mask rule'
  },

  testConnectModal: {
    errorTitle: 'DB instance {{instanceName}} connectivity test failed'
  },

  deleteDatabase: {
    confirmMessage: 'Confirm to delete DB instance "{{name}}"?',
    deletingDatabase: 'Deleting DB instance "{{name}}"...',
    deleteSuccessTips: 'DB instance "{{name}}" deleted successfully'
  },

  enabledAuditPlan: {
    text: 'Enable scan task for DB instance'
  },

  batchImportDataSource: {
    buttonText: 'Batch import DB instances',
    title: 'Batch import DB instances',
    importFile: 'Import',
    successTitle: 'Batch import DB instances successfully',
    requestAuditErrorMessage:
      'There are validation failures in the current import information, please modify it based on the prompts in the downloaded file and import it again'
  }
};
