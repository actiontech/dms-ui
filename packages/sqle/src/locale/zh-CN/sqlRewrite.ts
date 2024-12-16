// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ceDescription:
    'SQL合规重写可以基于触发的规则自动重写SQL，节省开发时间，提高工作效率。',
  featureName: 'SQL合规重写',

  actionName: 'SQL合规重写',
  alreadyRewrittenRules: '已重写的规则',
  businessInterventionRequired: '待人工介入的规则',
  overallRewriteSuggestions: '整体重写建议',
  rewriteDetails: '重写详情',
  noOptimizationSpaceForCurrentSql: '当前SQL无优化空间',
  completeRewrittenSqlStatement: '完整的重写SQL语句',
  viewDifferences: '查看差异',
  problemsSolved: '解决的问题',
  riskWarning: '风险提示',
  columnInformation: '列信息',
  indexInformation: '索引信息',
  createTableStatement: '建表语句',
  tableStructure: '表结构',
  aiIsThinking: 'AI 正在思考中...',
  generatingResultsWithLLM: '正在使用大模型生成结果，请稍候...',
  noBusinessLogicOptimizationNeeded: '当前SQL重写无需人工介入',
  pendingRewriteRules: '待重写的规则',
  enableDatabaseStructureOptimization: '启用数据库结构优化',
  noPendingRewriteRulesForCurrentSql: '当前SQL无需待重写的规则',
  copy: '复制',
  viewCurrentTableStructureInSqlAnalysis: '在SQL分析中查看当前表结构',
  databaseStructureChangeStatement: '数据库结构变更语句',
  sqlRewriteResult: 'SQL重写结果',
  rewriteRulesAffectingStructure:
    '以下优化项涉及数据结构调整，为确保系统稳定运行，请按需手动开启：',
  summary: '总结',
  sqlRewriteConclusion:
    '本次 SQL 重写基于 {{optimizedCount}} 条规则进行了优化，目前还有 {{remainingCount}} 条规则有待进一步优化。此外，有 {{businessCount}} 条规则需要人工处理。'
};
