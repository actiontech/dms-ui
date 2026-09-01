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
        business: 'Business',
        enabledScanTypes: 'Enabled scan types',
        dbTaskStatus: 'DB instance task status',
        taskStatus: {
          disabled: 'Disabled',
          normal: 'Enabled'
        },
        scanStatus: 'Collection status',
        notificationMethod: 'Notification method',
        createdAt: 'Created time',
        creator: 'Creator'
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
    businessScope: 'Business',
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

    scanTypeParams: {
      title: 'Edit scan details·{{typeName}}',
      hightPriorityConditions: {
        mark: 'Mark high-priority SQL',
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
    exportReport: 'Export report',
    exportScanTaskReport: 'Export scan task report',
    exportRemediationReport: 'Export SQL remediation report',
    exportDataSourceRemediationReport: 'Export data source remediation report',
    auditImmediately: 'Audit immediately',
    auditImmediatelySuccessTips: 'Audit triggered',
    exportTips: 'Exporting scan task details',
    remediationExport: 'SQL remediation',
    remediationExportTips: 'Exporting SQL management remediation report',
    remediationExportSuccessTips:
      'Export SQL management remediation report successfully',
    overview: {
      title: 'Overview',
      column: {
        auditPlanType: 'Intelligent scan type',
        auditRuleTemplate: 'Audit rule template',
        status: 'Enablement',
        statusHeaderTips:
          'Whether this scan type is turned on for scheduled collection.\n\n• Enabled: on; periodic collect runs; Collect now is available\n• Disabled: off; no collect; Collect now is unavailable',
        enableStatus: {
          normal: 'Enabled',
          disabled: 'Disabled'
        },
        taskStatus: {
          title: 'Execution status',
          headerTips:
            'Collection and audit are independent and may both be in progress. Hover to view the current status and update time.',
          collection: {
            collecting: 'Collecting',
            completed: 'Collection completed'
          },
          audit: {
            pendingAudit: 'Pending audit',
            auditing: 'Auditing',
            completed: 'Audit completed'
          },
          currentStatus: 'Current status: {{value}}',
          executionNode: 'Execution node: {{value}}',
          updatedAt: 'Updated at: {{value}}',
          statusSeparator: ', '
        },
        nextCollectionTime: {
          title: 'Next execution time',
          afterCollect: 'Show after collection',
          none: '—'
        },
        scanType: 'Collection method',
        connectionInfo: 'Connection information',
        collectedSqlCount: 'Collected SQL count',
        problematicSqlCount: 'Problematic SQL count',
        lastCollectResult: {
          title: 'Last collection result',
          none: '—',
          success: 'Success',
          successEmpty: 'Success with no data',
          failed: 'Failed',
          collectedSqlCount: 'Collected SQL count: {{n}}',
          roundSuccessCount: 'Collected this round: {{n}}',
          lastCollectionTime: 'Last collection time: {{time}}',
          copy: 'Copy'
        },
        lastAuditResult: {
          title: 'Last audit result',
          none: '—',
          success: 'Success',
          partialFailed: 'Partially failed',
          failed: 'Failed',
          problematicSqlCount: 'Problematic SQL count: {{n}}',
          lastAuditTime: 'Last audit time: {{time}}',
          copy: 'Copy'
        },
        lastCollectionTime: 'Last collection time'
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
        triggerCollect: 'Collect now',
        triggerCollectSuccessTips: 'Collect now triggered',
        triggerCollectDisabledTips: 'Please enable first',
        triggerCollectCollectingTips: 'Collection is in progress',
        triggerCollectTaskRunningTips: 'Task is running, please wait'
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
        auditStatus: 'Audit status',
        firstAuditResult: 'Initial audit result',
        currentAuditResult: 'Current audit result',
        pendingAudit: 'Pending audit',
        audited: 'Audited',
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
