// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'SQL Insights',
  ceTips:
    'When you need to monitor data source performance and identify root causes, use performance monitoring.',
  dataSourceSelect: 'Data Source',
  autoRefreshTimeGap: 'Auto-refresh interval',
  dateRange: {
    twentyFourHours: '24 hours',
    sevenDays: '7 days',
    thirtyDays: '30 days',
    custom: 'Custom'
  },
  chart: {
    xAxisTitle: 'Date',
    yAxisTitle: 'Value',
    noData: 'No Data',
    noValidData: 'No valid data in the selected area'
  },
  taskEnabledTips: {
    currentControlTypeNotEnabled: 'Current control type is not enabled',
    goToEnable: '[Enable]'
  },
  performanceTrend: {
    title: 'Data Source Performance Trend'
  },
  slowSqlTrend: {
    title: 'Slow SQL Trend'
  },
  topSqlTrend: {
    title: 'Top SQL Execution Trend'
  },
  activeSessionTrend: {
    title: 'Active Session Trend'
  },
  relatedSqlList: {
    title: 'SQL Related to Selected Period',
    dateRangePlaceholder: 'Please select date range',
    column: {
      sqlFingerprint: 'SQL Fingerprint',
      source: 'Source',
      executeStartAvg: 'Average execution time',
      maxExecuteTime: 'Maximum execution time',
      minExecuteTime: 'Minimum execution time',
      sumExecuteTime: 'Total execution time',
      lockWaitTime: 'Lock Wait Time'
    },
    source: {
      order: 'Workflow',
      sqlManage: 'SQL Control',
      workbench: 'SQL workbench'
    },
    actions: {
      analyzeSql: 'SQL Analysis',
      viewRelatedTransactions: 'View Related Transactions'
    },
    sqlFingerprintDetail: {
      title: 'SQL Fingerprint Detail',
      chart: {
        xAxisTitle: 'Date',
        yAxisTitle: 'Execution Cost',
        analyzeButtonText:
          'Click node to view detailed SQL analysis in SQL Analyze'
      }
    },
    sqlRelatedTransaction: {
      title: 'SQL Related Transactions',
      actions: {
        showSQAnalysis: 'View SQL analysis'
      },
      noData: 'No transaction data',
      originalSql: 'Original SQL',
      transactionInfo: {
        id: 'Transaction ID',
        lockType: 'Lock type',
        duration: 'Total transaction duration',
        startTime: 'Start time',
        state: 'Status',
        commitTime: 'Commit time',
        lockTypeDict: {
          exclusive: 'Exclusive lock',
          shared: 'Shared lock',
          intentionShared: 'Intention shared lock',
          intentionExclusive: 'Intention exclusive lock',
          sharedIntentionExclusive: 'Shared intention exclusive lock',
          rowLock: 'Row lock',
          tableLock: 'Table lock',
          metadataLock: 'Metadata lock'
        }
      },
      timeline: 'Transaction timeline',
      relatedSqlList: 'Related SQL list',
      sqlInfo: {
        executeDuration: 'Execution duration',
        lockType: 'Lock type',
        sqlAnalysis: 'SQL analysis'
      },
      lockAnalysis: {
        title: 'Lock wait analysis',
        desc: 'Table {{table_name}}: {{lock_type}} - acquired by {{create_lock_sql}}'
      }
    },
    noExecutionCostTrend: 'No execution cost trend data'
  }
};
