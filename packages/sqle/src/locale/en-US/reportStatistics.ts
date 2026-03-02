// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Report statistics',
  cardLine: {
    title: {
      orderTotal: 'Total workflows',
      todayIncreased: 'New workflows today',
      orderAverageAuditTime: 'Avg workflow audit time',
      auditPassRate: 'Audit pass rate'
    },
    noteCont: {
      deadline: 'Deadline {{time}}',
      orderAverageAuditTime: {
        min: 'Shortest',
        max: 'Longest'
      },
      auditPassRate: {
        passed: 'Passed',
        notPass: 'Not passed'
      }
    }
  },
  orderQuantityTrend: {
    title: 'Workflow trend',
    emptyText:
      'No data yet, choose other time period or create an workflow then come back to this page',
    timeLabel: 'Time period:',
    toolTip: {
      label: 'New workflow'
    }
  },
  workOrderState: {
    title: 'Workflow composition by workflow status',
    emptyText: 'No data yet, create an workflow then come back to this page',
    state: {
      waiting_for_audit: 'Pending audit',
      waiting_for_execution: 'Pending execution',
      executing: 'Executing',
      rejected: 'Rejected',
      executing_failed: 'Execution failed',
      closed: 'Closed',
      execution_success: 'Execution success'
    }
  },
  databaseTypeOrder: {
    title: 'Workflow composition by database type',
    emptyText: 'No data yet, create an workflow then come back to this page',
    tooltip: {
      number: 'Order quantity',
      proportion: 'Order proportion'
    }
  },
  databaseSourceOrder: {
    title: 'Data source composition by database type',
    emptyText: 'No data yet, purchase data source then come back to this page',
    sourceTotal: 'Total data source',
    sourceNumItem: 'Data source quantity',
    sourceProportionItem: 'Data source proportion'
  },
  licenseStatistics: {
    title: 'License usage',
    emptyText: 'No data yet, purchase license then come back to this page',
    used: 'Used',
    proportion: 'Proportion',
    charts: {
      validity: 'Validity',
      user: 'User quantity',
      instanceNum: 'Instance quantity'
    }
  },
  topList: {
    diffOrderReject: {
      title: 'Order rejection rate of different users (Top10)',
      noData: 'No data yet, create an workflow then come back to this page',
      column: {
        creator: 'Username',
        workflow_total_num: 'Total workflows',
        rejected_percent: 'Rejection rate'
      }
    },
    sqlOnLineSpendTime: {
      title: 'Avg SQL execution time (Top10)',
      noData: 'No data yet, create an workflow then come back to this page',
      column: {
        instance_name: 'Data source name',
        average_execution_seconds: 'Avg execution time',
        max_execution_seconds: 'Longest execution time',
        min_execution_seconds: 'Shortest execution time'
      }
    }
  },
  tableTopList: {
    noData: 'No data',
    noMoreData: 'No more data'
  },
  ce: {
    feature: {
      desc: 'If the administrator needs to fully understand the audit progress of the platform business and the usage of the platform, you can use the report statistics function. this function provides multi-dimensional business analysis perspectives to help administrators understand the audit efficiency of workflows and the quality of submitted SQLs, so as to carry out SQL audit work more efficiently and flexibly.'
    }
  },
  tabs: {
    report: 'Report Statistics',
    aiGovernance: 'AI Governance'
  },
  aiGovernance: {
    title: 'AI Governance Efficiency Center',
    period: {
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      thisQuarter: 'This Quarter',
      thisYear: 'This Year'
    },
    strategicInsight: {
      moduleTitle: 'Strategic Value Pillars',
      moduleDesc: 'Decision Layer'
    },
    efficiencyCard: {
      security_defense: 'High-Risk Elimination Rate',
      resource_cost: 'Performance Issue Optimization Rate',
      code_standard: 'SQL Standards Compliance Rate',
      rd_efficiency: 'Estimated Time Saved',
      query_performance: 'Average Performance Improvement'
    },
    managementView: {
      moduleTitle: 'Management View',
      moduleDesc: 'Analysis Layer',
      viewType: {
        comprehensive: 'Comprehensive View',
        rewrite: 'AI Smart Correction',
        tuning: 'AI Performance Engine'
      },
      projectIOAnalysis: {
        title: 'Project Team Input-Output Analysis',
        moduleTitle: 'Project Team Input-Output Analysis',
        moduleDesc: 'AI engine usage depth and health per business line',
        columns: {
          projectName: 'Project Team Name',
          activeMembers: 'Active Members',
          invokeCount: 'Invoke Count',
          performanceGain: 'Performance Gain',
          timeSaved: 'Time Saved',
          healthScore: 'Health Score'
        }
      },
      topProblemDistribution: {
        title: 'Top Problem Distribution',
        moduleTitle: 'Top Problem Analysis',
        moduleDesc: 'Code standards and syntax quality'
      }
    },
    executionData: {
      moduleTitle: 'Execution Log',
      moduleDesc: 'Data Layer',
      searchPlaceholder: 'Search SQL features or projects...',
      columns: {
        sourceProject: 'Source Project',
        sqlSnippet: 'SQL Snippet',
        functionModule: 'Function Module',
        valueDimension: 'Value Dimension',
        processStatus: 'Process Status',
        estimatedUpgrade: 'Estimated Upgrade',
        time: 'Time'
      },
      functionModule: {
        smartCorrection: 'AI Smart Correction',
        performanceEngine: 'AI Performance Engine'
      },
      valueDimension: {
        security: 'Security',
        performance: 'Performance Issue',
        correction: 'Correctness',
        maintenance: 'Maintainability',
        codeStandard: 'Code Standard'
      },
      processStatus: {
        pending: 'Pending',
        running: 'Running',
        completed: 'Completed',
        failed: 'Failed'
      }
    }
  }
};
