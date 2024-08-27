// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Notification',
  pushRule: {
    title: 'Configuration',
    workflowUpdateNotifier: {
      label: 'Workflow update notification',
      labelTips:
        'When the workflow status changes, it will be automatically pushed to members with operation permissions',
      pushFrequency: 'Notification frequency',
      pushFrequencyTips:
        'Schedule notification according to crontab format. the current display time is based on the browser local time. the accurate time is determined by the server time.',
      pushFrequencyValueFormatter: 'Next notification time is {{time}}',
      pushFrequencyErrorTips:
        'The current crontab expression format is incorrect!',
      pushFrequencyEmptyTips: 'The current crontab expression is empty!',
      pusher: 'Pusher',
      lastPushTime: 'Last notification time',
      permissionMatch:
        'Match members with operation permissions according to permissions',
      immediately: 'Trigger immediately based on workflow status change',
      successTips: 'Update success!',
      enabledConfirmTitle:
        'This operation will enable the configuration. continue?',
      closedConfirmTitle:
        'This operation will close the configuration. continue?'
    },
    sqlManagementIssuePush: {
      CETips:
        'If you have configured high-priority SQL standards and want to keep up with these potential problem SQLs in a timely manner to avoid causing larger accidents, you can enable SQL management notification capability. the platform will timely expose the problem SQLs you care about.',
      label: 'SQL management issue push',
      labelTips:
        'When there are problematic SQLs in SQL management, they will be automatically pushed to designated members',
      pushFrequency: 'notification frequency',
      pusher: 'Pusher',
      lastPushTime: 'Last notification time',
      closedConfirmTitle:
        'Closing the configuration will not preserve the current editing information. confirm closing the configuration?',
      form: {
        pushFrequency: 'Notification frequency',
        pushFrequencyValidator: 'Please enter a positive integer',
        pusher: 'Pusher',
        cronTips:
          'Manually enter the crontab format time, or click the button on the right to enable visual selection'
      }
    },
    SqlManagementQualityReport: {}
  }
};
