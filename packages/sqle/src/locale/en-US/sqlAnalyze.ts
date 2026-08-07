// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL Analysis',
  pageDesc: 'You can view the parsed SQL statements here.',
  sqlExplain: 'SQL Explain',
  tableTitle: '{{tableName}} table',
  columnInfo: 'Column information',
  indexInfo: 'Index information',
  sqlStatement: 'SQL statement',
  optimize: 'AI Performance Tuning',
  optimization: {
    confirmTitle: 'Enable high-precision index recommendation?',
    confirmContent:
      'High-precision index recommendation calculates column selectivity in SQL to provide more accurate index optimization suggestions, but may cause significant database performance overhead.',
    enableHighAnalysis: 'Yes, enable high-precision recommendation',
    useRegularAnalysis: 'No, use standard recommendation'
  },
  optimizationResultDrawer: {
    title: 'AI Performance Tuning result details',
    trackProgressTips:
      'You can also track progress on the Quick Diagnosis > AI Performance Tuning page',
    resultTips:
      'Optimization in progress. Estimated completion in 5-10 minutes. Thank you for your patience.'
  }
};
