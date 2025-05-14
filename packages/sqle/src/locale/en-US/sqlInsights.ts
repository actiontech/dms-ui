// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'SQL Insights',
  dataSourceSelect: 'Data Source',
  dateRange: 'Date Range',
  chart: {
    xAxisTitle: 'Date',
    yAxisTitle: 'Value',
    noData: 'No Data',
    noValidData: 'No valid data in the selected area'
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
      executeStartTime: 'Execution Start Time',
      executeEndTime: 'Execution End Time',
      executeTime: 'Execution Time',
      lockWaitTime: 'Lock Wait Time'
    },
    source: {
      order: 'Order',
      sqlManage: 'SQL Control'
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
      title: 'SQL Related Transactions'
    },
    noExecutionCostTrend: 'No execution cost trend data'
  }
};
