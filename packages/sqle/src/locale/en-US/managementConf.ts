// eslint-disable-next-line import/no-anonymous-default-export
export default {
  common: {
    backToConf: 'Back to intelligent scan configuration'
  },
  list: {
    pageTitle: 'SQL management configuration',
    pageAction: {
      enableAuditPlan: 'Enable scan tasks for DB instance',
      planType: 'Task type'
    },
    table: {
      filter: {
        taskType: {
          allDataSource: 'All DB instances',
          allTaskType: 'All task types'
        },
        status: {
          disabled: 'Disabled',
          normal: 'Normal'
        }
      },
      column: {
        staticScanType: 'Static scan',
        dbName: 'DB instance name',
        dbType: 'DB instance type',
        environmentAttribute: 'Environment attribute',
        enabledScanTypes: 'Enabled scan types',
        dbTaskStatus: 'DB instance task status',
        taskStatus: {
          disabled: 'Disabled',
          normal: 'Enabled'
        },
        scanStatus: 'Collection status',
        notificationMethod: 'Notification method',
        createdAt: 'Created time',
        creator: 'Creator',
        abnormalTips: 'SQL collection exception detected'
      },
      action: {
        disabled: {
          text: 'Disable',
          confirmTips:
            'All data will no longer be updated after disabling. confirm disable?',
          successTips: 'Disabled successfully'
        },
        enabled: {
          text: 'Enable',
          successTips: 'Enabled successfully'
        },
        delete: {
          confirmTips:
            'All data will no longer be retained after deletion. confirm delete?',
          successTips: 'Deleted successfully'
        }
      }
    }
  },
  create: {
    title: 'Enable scan tasks for DB instance',
    dataSourceSelection: 'Select DB instance',
    dataSourceNeedsAudit: 'Is DB instance audit required',
    environmentAttribute: 'Environment attribute',
    instanceName: 'DB instance name',
    instanceNameTips: 'Select business to get corresponding DB instance',
    schema: 'Database',
    schemaTips:
      'If database is selected, only the corresponding SQL for that database will be collected',
    scanTypesSelection: 'Select scan types',
    scanType: 'Scan type',
    scanTypeRequiredMessage: 'Select one scan task',
    scanTypeTips: 'Select the SQL objects you need to scan',
    emptyScanTypeTips:
      'Select the DB instance type to get the corresponding scan task type',
    performanceInsights: {
      title: 'Performance monitoring',
      lable: 'Enable performance metric collection',
      tips: 'Performance metric collection may cause significant overhead. Use with caution. Once enabled, the system continuously collects performance data (such as QPS and connections) from the data source and generates performance trend charts.'
    },
    scanTypeParams: {
      title: 'Edit scan details·{{typeName}}',
      hightPriorityConditions: {
        mark: 'Mark high-priority SQL',
        markTips:
          'Set filter conditions. SQL matching any enabled condition below will be marked as high priority.',
        standard: 'Standard',
        threshold: 'Threshold',
        operator: 'Operator'
      },
      auditTemplate: {
        ruleTemplate: {
          label: 'Audit rule template',
          tip: 'If this is not specified, the template bound to the DB instance will be used first'
        }
      }
    },
    defaultScanTypes: {
      sqlFile: 'SQL file',
      myBatisFile: 'MyBatis file',
      allAppExtract: 'Application SQL capture',
      default: 'Custom'
    },
    result: {
      title: 'Create SQL management configuration successfully',
      reset: 'Reset form',
      jumpToDetail: 'View configuration details'
    }
  },
  update: {
    successTips: 'Update intelligent scan configuration successfully!'
  },
  detail: {
    title: '{{instanceName}} intelligent scan details',
    staticScanTypes: 'Static scan',
    export: 'Export',
    auditImmediately: 'Audit immediately',
    auditImmediatelySuccessTips: 'Audit successfully',
    exportTips: 'Exporting scan task details',
    overview: {
      title: 'Overview',
      column: {
        auditPlanType: 'Intelligent scan type',
        performanceCollectTips:
          'Performance metric collection may cause significant overhead. Use with caution. Once enabled, the system continuously collects performance data (such as QPS and connections) from the data source and generates performance trend charts on the performance insights page.',
        auditRuleTemplate: 'Audit rule template',
        status: 'Task status',
        scanType: 'Collection method',
        connectionInfo: 'Connection information',
        collectedSqlCount: 'Collected SQL count',
        problematicSqlCount: 'Problematic SQL count',
        lastCollectionTime: 'Last collection time',
        taskStatus: {
          disabled: 'Disabled',
          normal: 'Running',
          abnormal: 'Abnormal'
        },
        abnormalTips:
          'Please search sqled.log for related information using the keyword "execute extract sql failed"'
      },
      actions: {
        enabled: 'Enable',
        enabledSuccessTips: 'Enabled successfully!',
        disabled: 'Disable',
        disabledSuccessTips: 'Disabled successfully!',
        disabledConfirmTips:
          'After disabling, this type of SQL will no longer be scanned, current data will be retained, confirm disable?',
        delete: 'Delete',
        deleteSuccessTips: 'Deleted successfully!',
        deleteConfirmTips:
          'After deleting, intelligent scan data of this type will no longer be retained, confirm delete?',
        resetToken: 'Reset token',
        resetTokenSuccessTips: 'Token reset successfully!',
        resetTokenConfirmTitle:
          'A new token will be generated after reset, valid for 365 days. The old token will be invalidated immediately. Continue?'
      }
    },
    scanTypeSqlCollection: {
      filter: {
        searchInputPlaceholder: 'Enter SQL, rule name'
      },
      action: {
        urgentAudit: 'Audit immediately',
        lastAuditTime: 'Last audit time: {{time}}'
      },
      column: {
        index: 'Index',
        sqlFingerprint: 'SQL fingerprint',
        source: 'Source',
        belongingDataSource: 'Belonging DB instance',
        execTime: 'Execution time',
        lastAppearanceTime: 'Last appearance time',
        firstAppearanceTime: 'First appearance time',
        occurrenceCount: 'Occurrence count',
        status: 'Status',
        explanation: {
          text: 'Explanation',
          operator: 'Add explanation'
        },
        sqlAuditResultReportTitle: 'SQL audit result',
        action: {
          analysis: 'Analysis'
        }
      }
    }
  }
};
