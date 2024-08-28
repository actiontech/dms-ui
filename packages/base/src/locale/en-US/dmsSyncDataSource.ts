/* eslint-disable import/no-anonymous-default-export */
export default {
  pageTitle: 'External DB instance sync',
  pageDesc:
    'You can add external DB instances platform configuration here, SQLE will periodically synchronize data sources from external platforms.',
  ceTips:
    'When users add data sources on other platforms, if they want to monitor the SQL quality of these data sources, they can use the external data source synchronization function of the SQLE platform to synchronize the data sources of the external platform to SQLE.\nthis can avoid the duplication of adding data sources on two platforms, reducing management difficulty.',
  syncTaskList: {
    title: 'Sync task list',
    addSyncTask: 'Add sync task',
    syncTaskLoading: 'Syncing task...',
    syncTaskSuccessTips: 'Sync task success',
    deleteTaskLoading: 'Deleting task...',
    deleteTaskSuccessTips: 'Delete task success',
    columns: {
      name: 'Sync task name',
      source: 'Source',
      version: 'Version',
      url: 'Address',
      instanceType: 'DB instance type',
      lastSyncResult: 'Last sync result',
      lastSyncSuccessTime: 'Last successful sync time',
      sync: 'Sync',
      deleteConfirmTitle:
        'Are you sure you want to delete the current sync task?'
    }
  },

  addSyncTask: {
    title: 'Add sync task',
    successTips: 'Add sync task success',
    successGuide: 'Go to sync task list to view added sync task',
    backToList: 'Back to sync task list'
  },
  updateSyncTask: {
    title: 'Edit sync task',
    successTips: 'Sync task edit success',
    getSyncInstanceTaskError: 'Failed to get sync task data'
  },
  syncTaskForm: {
    name: 'Sync task name',
    source: 'Source',
    url: 'Address',
    urlTips: 'Third-party platform address',
    instanceType: 'DB instance type',
    ruleTemplateName: 'Audit rule template',
    syncInterval: 'Sync interval',
    baseConfig: 'Basic configuration',
    sqlConfig: 'SQL audit configuration',
    cronConfig: 'Custom task sync cycle',
    cronTips:
      'Manually enter Crontab format time, or click the button on the right to enable visual selection',
    helpTips:
      'Before and after creating a sync task, users must configure it on the data source platform. for more usage instructions, please refer to'
  }
};
