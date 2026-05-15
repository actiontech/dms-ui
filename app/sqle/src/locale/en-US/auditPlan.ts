// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Smart scan',
  pageDesc:
    'You can use the smart scan feature to generate scan task reports to monitor and evaluate the quality of sql.',

  list: {
    title: 'Scan task list',
    filter: {
      all: {
        dataSource: 'All DB instances',
        taskType: 'All task types'
      }
    },
    tip: {
      token: {
        show: 'Click again to hide',
        hide: 'Encrypted, click to view details, click again to hide'
      }
    },
    table: {
      audit_plan_cron: 'Audit cycle',
      audit_plan_db_type: 'Database type',
      audit_plan_instance_database: 'Audited database',
      audit_plan_instance_name: 'DB instance name',
      audit_plan_name: 'Task name',
      audit_plan_token: 'Access credential',
      audit_plan_token_tips: 'Used to upload credentials for audit tasks',
      audit_plan_type: 'Task type',
      audit_rule_template: 'Audit rule template'
    },
    operator: {
      notice: 'Subscribe to audit failure messages'
    }
  },

  action: {
    create: 'Create scan task',
    backButton: 'Back to scan task list',
    backDetail: 'Back to scan task details'
  },

  remove: {
    confirm: 'Are you sure you want to remove scan task {{name}}?',
    loading: 'Removing scan task {{name}}...',
    successTips: 'Removed scan task {{name}} successfully'
  },

  create: {
    title: 'Create scan task',
    form: {
      name: 'Scan task name'
    },
    subTitle: {
      dataSource: 'Select DB instance',
      editTaskDetail: 'Edit task details',
      chooseAuditTemplate: 'Select audit template',
      customTaskAuditCycle: 'Custom task audit cycle'
    },
    successTitle: 'Scan task created successfully',
    successGuide: 'View scan task details',
    clonePlan: 'Clone scan task'
  },

  update: {
    title: 'Update scan task {{name}}',
    successTitle: 'Updated scan task {{name}} successfully',
    successGuide: 'Back to scan task list'
  },

  planForm: {
    dataSource: {
      dbType: 'DB instance type',
      databaseName: {
        label: 'DB instance name',
        tip: 'If you do not specify a DB instance, the scan task will use the default rule template of the database type you selected for static auditing'
      },
      schema: 'Database'
    },
    taskDetail: {
      taskType: 'Task type'
    },
    auditTemplate: {
      ruleTemplateName: {
        label: 'Audit rule template',
        tip: 'If this is not specified, the template bound to the DB instance will be used preferentially'
      }
    },
    cronName: {
      label: 'Task audit cycle',
      tip: 'Manually enter the crontab formatted time, or click the button on the right to enable visual selection'
    }
  },

  detail: {
    action: {
      audit: 'Audit now'
    },
    tip: {
      rate: 'Audit result score'
    }
  },

  detailPage: {
    pageTitle: 'Task name: {{name}}',
    auditTaskType: 'Task type: {{type}}',
    pageDesc:
      'You can view the sql statistics of the current smart scan task and the audit records of the current task here'
  },

  sqlPool: {
    title: 'Sql statistics',

    table: {
      fingerprint: 'Sql fingerprint',
      lastReceiveText: 'Last statement matched to this fingerprint',
      lastReceiveTime: 'Last time matched to this fingerprint',
      count: 'Number of statements matched to this fingerprint'
    },

    action: {
      trigger: 'Audit now',

      loading: 'Triggering audit...',
      triggerSuccess: 'Audit triggered successfully'
    }
  },

  record: {
    generateTime: 'Generation time',
    highRuleLevel: 'Highest error level encountered in audit'
  },

  planTaskRecord: {
    title: 'Audit record',
    passRage: 'Audit pass rate'
  },

  report: {
    time: 'Report generation time: {{time}}',
    sourceLabel: 'Audit report score',
    passRageLabel: 'Audit pass rate',
    rule_template: 'Rule template: {{name}}',
    status_pass_text: 'Audit passed',
    drawer: {
      title: 'Sql audit results',
      action: 'Analyze statement',
      subTitle: {
        result: 'Audit result',
        sql: 'Sql statement'
      },
      source: 'Source file',
      sourceTip: 'Currently only supports viewing sql sources in zip/git files',
      fileLine: 'Line number'
    },
    exportBtnText: 'Download scan task report',

    table: {
      sql: 'Sql statement',
      result: 'Audit result',
      analyze: 'Analyze'
    }
  },

  subscribeNotice: {
    title: 'Subscribe to audit failure messages',

    form: {
      interval: 'Notification interval (minutes)',
      intervalTips:
        'Notification interval refers to the minimum time interval between two pushes. even if an error occurs in the audit within the "interval time" after a push, no notification will be made. until the interval time has passed and a new error has been triggered, the next notification will be made. if you want to receive all pushes, you can set this interval to 0',

      level: 'Alert level threshold',
      levelTips:
        'Only errors with an alert level higher than or equal to the selected alert level in the audit result will trigger a push',

      emailEnable: 'Enable email notification',
      emailEnableTips: 'Emails will be sent to the scan task creator',

      webhooksEnable: 'Enable webhooks notification',
      webhooksEnableCe: 'Webhooks notification is a enterprise edition feature',
      webhooksUrl: 'Webhooks url',
      webhooksTemplate: 'Webhooks template (json)',

      webhooksTemplateHelp: {
        title: 'Please follow these rules when filling in the template',
        rule1:
          'Please fill in the template in the correct json format. in theory, there are no restrictions on the field name, number of fields, etc. you only need to ensure that the json format is correct.',
        rule2:
          'Variables in the template will be automatically replaced during push, for changes, please refer to the variable description below',

        supportVariable: 'Supported variables',
        table: {
          desc: 'Variable description',
          variable: 'Variable'
        },
        variable: {
          subject: 'Alert title',
          body: 'Alert content'
        },

        reset: 'Reset template to default template'
      },

      test: 'Send test message',
      testTips: 'Please submit the configuration first before testing',
      testLoading:
        'Sending test message to the subscription configuration of scan task {{name}}...',
      testSuccess: 'Test message sent successfully',
      subscribeNoticeSuccess: 'Subscription successful'
    }
  }
};
