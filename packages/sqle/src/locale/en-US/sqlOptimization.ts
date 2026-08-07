// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Sql optimization',
  ceTips:
    'When you need to get sql rewrite suggestions and optimize sql execution performance, you can use the sql optimization feature provided by the platform, and also get multiple optimization results such as sql rewriting, index optimization, and performance verification',
  noConfiagurationTips:
    'AI Performance Tuning helps you automatically optimize SQL performance. This is a paid add-on module. Please contact sales for details.',
  table: {
    optimizationId: 'Optimization id',
    numberOfRule: 'Total tuning rules triggered',
    numberOfIndexx: 'Total indexes',
    optimizationName: 'Name',
    instanceName: 'DB instance',
    dbType: 'Db type',
    performanceGain: 'Performance gain',
    createTime: 'Create time',
    status: 'Status',
    creator: 'Creator',
    autoRefresh: 'Auto refresh',
    openAutoRefreshTips: 'Enable auto refresh (refreshes every 5 seconds)',
    closeAutoRefreshTips:
      'Disable auto refresh (currently refreshes every 5 seconds)',
    view: 'View',
    adoptionRate: 'Adoption rate'
  },
  status: {
    finish: 'Optimization success',
    failed: 'Optimization failed',
    optimizing: 'Optimization in progress'
  },
  create: {
    linkButton: 'Create sql optimization',
    returnButton: 'Return to sql optimization list',
    successTips: 'Create sql optimization successfully',
    base: {
      title: 'Create sql optimization',
      name: 'Sql optimization name'
    },
    sqlInfo: {
      title: 'Input sql',
      dbType: 'Db type',
      instanceName: 'DB instance',
      instanceSchema: 'Database',
      uploadType: 'Select sql statement upload method',
      optimize: 'Optimize',
      tips: 'To improve the accuracy of the optimization results, the system will perform database analysis operations',
      format: 'Sql beautify',
      formatTips:
        'Currently, the database types that support sql beautify are {{supportType}}. if no data source is selected or the data source type selected is not yet supported, sql beautification may result in sql statement syntax errors.',
      enableHighAnalysis: 'Enable high-precision index recommendation',
      enableHighAnalysisTips:
        'Calculates column selectivity in SQL and may cause significant database performance overhead',
      form: {
        optimizationType: 'Tuning type',
        optimizationTypeDesc:
          'During online tuning, the platform provides suggestions based on the actual schema of the selected data source; during offline tuning, the platform does not connect to the data source.',
        onlineOptimization: 'Online tuning',
        offlineOptimization: 'Offline tuning',
        sql: 'SQL statement',
        executionPlan: 'Execution plan',
        executionPlanPlaceholder: 'Enter execution plan (optional)',
        tableStructure: 'Table structure',
        tableStructurePlaceholder: 'Enter table structure (optional)'
      },
      uploadTypeEnum: {
        sql: 'Input SQL statement',
        sqlFile: 'Upload SQL file',
        mybatisFile: 'Upload Mybatis XML file',
        zipFile: 'Upload ZIP file',
        git: 'Configure GIT repository'
      },
      uploadLabelEnum: {
        sql: 'SQL statement',
        sqlFile: 'SQL file',
        mybatisFile: 'Mybatis XML file',
        zipFile: 'ZIP file',
        gitUrl: 'GIT address'
      },
      uploadFileTip: {
        sqlFile: 'Click to select a SQL file or drag the file to this area',
        mybatisFile:
          'Click to select a Mybatis XML file or drag the file to this area',
        zipFile:
          'Click to select a ZIP file or drag the file to this area. Currently, only .xml and .sql files in the ZIP file can be audited for SQL'
      }
    },
    resultTips:
      'Optimization in progress. Estimated completion in 5-10 minutes. Thank you for your patience.',
    simpleSqlTips:
      'Currently, only single SQL statements are supported for tuning',
    resetForm: 'Reset form'
  },
  overview: {
    sqlTable: {
      order: 'Order',
      sql: 'Sql text',
      syntaxError: 'Syntax error',
      recommendedIndex: 'Recommended index',
      hitIndex: 'Hit index',
      rewriteNumber: 'Rewrite optimization',
      performanceImprovement: 'Performance improvement',
      indexUsed: 'Index used',
      buttonText: 'Optimization details'
    },
    optimizationOverview: {
      title: 'Optimization overview',
      queryNumber: 'Parsed sql',
      rewriteNumber: 'Optimized sql',
      indexNumber: 'Optimized recommended index',
      performance: 'Performance improvement after optimization'
    },
    recommendedIndex: 'Recommended index',
    recommendedIndexTips:
      'Concentrate display of index recommendations generated based on each sql',
    sqlTableTitle: 'Sql statement list',
    indexTips: 'No index needs to be optimized',
    optimizingStatusTips:
      'Optimization in progress, please refresh to get the latest results',
    failedStatusTips: 'Optimization failed'
  },
  detail: {
    returnButton: 'Return to performance optimization overview',
    sqlRewrite: {
      title: 'Sql rewrite',
      originalSql: 'Original sql',
      optimizedSql: 'Rewritten sql'
    },
    triggeredRule: {
      title: 'Rule applied in this rewrite optimization'
    },
    recommenderIndex: {
      title: 'Recommended index'
    },
    performanceValidation: {
      title: 'Performance validation',
      performImprove: 'Performance improvement',
      performImproveDesc:
        'It is expected that the performance of this sql will improve after this optimization is implemented',
      beforePlan: 'Execution plan (before optimization)',
      afterPlan: 'Execution plan (after optimization)'
    }
  },
  result: {
    viewOptimizationResult: 'Back to AI Performance Tuning list',
    newOptimizedQuery: 'The new optimized query is',
    originalQuery: 'The original SQL query is',
    bestPerformanceSqlTips:
      'This SQL is already at optimal performance. No changes were made. The original SQL is shown below.',
    indexOptimizationAdvice: 'Index optimization recommendations',
    indexOptimizationAdviceTips:
      'Before executing the final optimized SQL above, please create the following indexes first',
    indexOriginalAdviceTips:
      'Before executing the original SQL, please create the following indexes first',
    optimizedExecutionPlan: 'Optimized execution plan',
    viewDifference: 'View differences',
    viewTableStructure: 'View table structure',
    expand: 'Expand',
    performanceImprovement: 'Performance improvement',
    automaticOptimization: 'Automatic optimization',
    whichOptimizationRulesUsed: 'Which optimization rules were used?',
    clickToViewRuleEffect:
      'Click to view the impact of each rule on the SQL statement',
    compareSqlDifferences: 'Compare SQL before and after optimization',
    viewTableStructureAndOptimalIndex:
      'View table structure and optimal indexes',
    viewOptimizationResults: 'View optimization results',
    compareExecutionPlanDifferences:
      'Compare execution plans before and after optimization',
    tableStructureForQuery: 'Table structure for this query',
    optimalIndexForQuery: 'Optimal indexes for this query',
    details: 'Details',
    beforeOptimization: 'Before optimization',
    afterOptimization: 'After optimization',
    original: 'Original',
    finalOptimized: 'Final optimized',
    originalExecutionPlan: 'Original execution plan',
    exitFullscreen: 'Exit fullscreen',
    fullscreenDisplay: 'Fullscreen',
    drawerTitle: 'AI Performance Tuning result details',
    optimizing: 'Optimization in progress',
    moduleGenerating: 'Generating',
    moduleFailed: 'Run failed',
    bestIndexUsedForOriginalSql:
      'Congratulations! Your original SQL already uses optimal indexes. No further optimization is available.',
    bestIndexUsedForOptimizedSql:
      'Congratulations! Your final optimized SQL already uses optimal indexes. No further optimization is available.',
    cannotOptimizeByIndexTips:
      'Note: Your SQL cannot be optimized through indexes alone. Consider the following adjustments:',
    sqlQueryAlreadyOptimal:
      'Congratulations! Your SQL query configuration is already excellent. No further optimization is needed.'
  },
  feedback: {
    sectionTitle: 'Evaluation Feedback',
    reviewRecords: 'Review Records',
    agreeButton: 'Approve',
    disagreeButton: 'Reject',
    reasonPlaceholder: 'Enter a note (optional)',
    saveButton: 'Save',
    cancelButton: 'Cancel',
    reEditButton: 'Re-edit',
    deleteButton: 'Delete',
    submittedAgree: 'Approved',
    submittedDisagree: 'Rejected',
    deleteConfirmTitle: 'Confirm to delete this feedback?',
    deleteSuccess: 'Feedback deleted successfully',
    submitSuccess: 'Feedback submitted successfully',
    updateSuccess: 'Feedback updated successfully',
    noRecords: 'No feedback records',
    agreeLabel: 'Approve',
    disagreeLabel: 'Reject'
  }
};
