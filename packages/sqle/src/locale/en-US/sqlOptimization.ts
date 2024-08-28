// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Sql optimization',
  ceTips:
    'When you need to get sql rewrite suggestions and optimize sql execution performance, you can use the sql optimization feature provided by the platform, and also get multiple optimization results such as sql rewriting, index optimization, and performance verification',
  table: {
    optimizationId: 'Optimization id',
    optimizationName: 'Name',
    instanceName: 'DB instance',
    dbType: 'Db type',
    performanceGain: 'Performance gain',
    createTime: 'Create time',
    status: 'Status',
    creator: 'Creator'
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
        'Currently, the database types that support sql beautify are {{supportType}}. if no data source is selected or the data source type selected is not yet supported, sql beautification may result in sql statement syntax errors.'
    }
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
  }
};
