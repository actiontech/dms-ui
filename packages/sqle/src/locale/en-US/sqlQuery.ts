// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL Console',
  pageDescribe:
    'You can perform audited SQL operations on data sources that you have access to.',
  eeErrorTips:
    'SQL query is not configured in this environment. Please configure it before use.',
  eeErrorTips2:
    'For configuration methods and usage instructions, please refer to the documentation.',
  jumpToCloudbeaver: 'Open SQL Console',
  databaseTables: {
    title: 'Database Tables',
    tabTitle: '{{tableName}} Structure',
    columns: 'Column Information',
    index: 'Index Information',
    createdTableSql: 'Create Table Statement'
  },
  executeResult: {
    title: 'Execution Result',
    errorMessageTitle: 'Query Error',
    resultTitle: 'Result {{index}}',
    paginationInfo:
      'Current data is on page {{current_page}}, showing records {{start_line}} to {{end_line}}, query time {{execution_time}}ms'
  },
  executePlan: {
    title: 'Execution Plan {{index}}',
    sql: 'SQL Statement',
    planCost: 'SQL execution plan cost trend',
    twentyFourHours: '24 hours',
    sevenDays: '7 days',
    thirtyDays: '30 days',
    costValue: 'Cost value',
    emptyText: 'No data. Select another time range to view',
    compareDifference: 'Compare execution plans',
    compareTips:
      'Click a node to view the detailed execution plan. Click a selected node to deselect it',
    compareCountLimitTips:
      'Only two nodes can be compared. Please deselect one selected node before choosing another',
    cost: 'Cost',
    sqlExplain: 'Execution Plan',
    performanceStatistics: 'Performance Statistics',
    getPerformanceStatistics: 'Fetch',
    getPerformanceStatisticsTips:
      'This operation executes real SQL and may affect database performance. Use with caution in production. Confirm fetch?',
    affectRows: 'Affected Rows',
    affectRowTips:
      'Different from the rows column in the execution plan, it shows the actual number of rows affected by the SQL.',
    optimize: 'AI Performance Tuning'
  }
};
