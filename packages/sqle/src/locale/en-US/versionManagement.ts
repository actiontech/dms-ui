// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Version management',
  ceTips:
    'In collaborative database development, version management allows you to easily track and control SQL changes, monitor the entire process from development to production, and keep track of dispatch progress to ensure your database changes are safe and controllable.',
  operation: {
    add: 'Add version',
    backToListPage: 'Back to version list'
  },
  list: {
    column: {
      name: 'Version name',
      desc: 'Version description',
      status: 'Version status',
      createTime: 'Creation time',
      lockTime: 'Lock time'
    },
    action: {
      lock: 'Lock',
      lockConfirm:
        'Once locked, changes cannot be made to the version content. Confirm lock?',
      deleteConfirm:
        'Deleting the version record will remove the version tag from the workflow. Confirm delete?',
      locking: 'Locking version...',
      lockSuccessTip: 'Version locked successfully',
      deleting: 'Deleting version...',
      deleteSuccessTip: 'Version deleted successfully'
    },
    locked: 'Locked',
    releasing: 'Releasing'
  },
  create: {
    title: 'Create version',
    successTips: 'Version created successfully',
    viewVersionDetail: 'View version details',
    continueText: 'Continue creating version'
  },
  update: {
    title: 'Update version',
    successTips: 'Version updated successfully'
  },
  form: {
    baseInfo: 'Version basic information',
    name: 'Version name',
    nameTip:
      'Please fill in an identifiable version name for this dispatch, e.g., SQLE2_2409_0',
    desc: 'Version description',
    descTip:
      'Please describe the purpose of this dispatch, indicating the scope of version changes',
    deploymentStageConf: 'Stage configuration',
    addStage: 'Add stage',
    stageName: 'Stage name',
    instance: 'Data source',
    dev: 'Development',
    test: 'Testing',
    prod: 'Production'
  },
  detail: {
    backToVersionDetail: 'Back to version details',
    deploy: 'dispatch',
    execute: 'Execute'
  },
  release: {
    title: 'Batch dispatch workflows',
    disableTips:
      'Workflows need to be dispatched sequentially, and you must have the permission to create workflows for the next stage data source. Ensure that the current order of workflows is successfully online and check your permissions.',
    currentAllowReleaseWorkflow:
      'Workflows will be dispatched sequentially. The following workflows meet the dispatch conditions for the current stage',
    targetDataSource: 'Target data source',
    currentDataSource: 'Current data source',
    schemaPlaceholder: 'Please select a database (optional)',
    successTips: 'Batch dispatch of workflows successful'
  },
  execute: {
    title: 'Batch execute workflows',
    disableTips:
      'Workflows will be executed sequentially. Ensure the next workflow meets the execution conditions before attempting the execution operation.',
    currentAllowExecuteWorkflow:
      'Workflows will be executed sequentially. The following workflows meet the execution conditions for the current stage. Confirm execution?',
    successTips: 'Batch execution of workflows successful'
  },
  stageNode: {
    workflowDesc: 'Workflow description',
    executeTime: 'Execution time',
    updateInfo: 'Update workflow',
    offlineExecuted: 'Executed offline',
    addExistingWorkflow: 'Add existing workflow',
    createWorkflow: 'Create new workflow'
  },
  associateWorkflow: {
    title: 'Associate existing workflow',
    workflow: 'Workflow',
    workflowName: 'Workflow name',
    workflowDesc: 'Workflow description',
    workflowStatus: 'Workflow status',
    successTips: 'Workflow associated successfully'
  },
  offlineExec: {
    title: 'Offline execution',
    remarks: 'Remarks',
    successTips: 'Offline execution successful'
  }
};
