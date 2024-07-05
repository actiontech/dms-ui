// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '智能调优',
  ceTips:
    '当您需要获得SQL重写建议、优化SQL执行性能时，可以使用平台提供的智能调优功能，同时获取SQL改写、索引优化、性能验证等多重优化结果',
  table: {
    optimizationId: '调优ID',
    optimizationName: '名称',
    instanceName: '数据源',
    dbType: '数据库类型',
    performanceGain: '优化提升性能',
    createTime: '创建时间',
    status: '状态',
    creator: '创建人'
  },
  status: {
    finish: '调优成功',
    failed: '调优失败',
    optimizing: '调优进行中'
  },
  create: {
    linkButton: '创建智能调优',
    returnButton: '返回智能调优列表',
    successTips: '创建智能调优成功',
    base: {
      title: '创建智能调优',
      name: '智能调优名称'
    },
    sqlInfo: {
      title: '输入SQL',
      dbType: '数据库类型',
      instanceName: '数据源',
      instanceSchema: '数据库',
      uploadType: '选择SQL语句上传方式',
      optimize: '调优',
      tips: '为了提高调优结果的准确度，系统将执行数据库分析操作',
      format: 'SQL美化',
      formatTips:
        '目前，支持 SQL 美化的数据库类型有 {{supportType}}。如果未选择数据源或选择的数据源类型尚未得到支持，进行 SQL 美化可能会导致 SQL 语句语法错误。'
    }
  },
  overview: {
    sqlTable: {
      order: '序号',
      sql: 'SQL文本',
      syntaxError: '语法错误',
      recommendedIndex: '推荐索引',
      hitIndex: '命中索引',
      rewriteNumber: '重写优化',
      performanceImprovement: '性能提升',
      indexUsed: '使用的索引',
      buttonText: '优化详情'
    },
    optimizationOverview: {
      title: '优化概要',
      queryNumber: '已解析的SQL',
      rewriteNumber: '已优化的SQL',
      indexNumber: '优化推荐的索引',
      performance: '优化后的性能提升'
    },
    recommendedIndex: '推荐索引',
    recommendedIndexTips: '集中展示基于每一条SQL产生的索引推荐',
    sqlTableTitle: 'SQL语句列表',
    indexTips: '暂无需要优化的索引',
    optimizingStatusTips: '调优进行中，请刷新获取最新结果',
    failedStatusTips: '调优失败'
  },
  detail: {
    returnButton: '返回性能优化概览',
    sqlRewrite: {
      title: 'SQL重写',
      originalSql: '原SQL',
      optimizedSql: '重写后SQL'
    },
    triggeredRule: {
      title: '本次重写优化应用的规则'
    },
    recommenderIndex: {
      title: '推荐索引'
    },
    performanceValidation: {
      title: '性能验证',
      performImprove: '性能提升',
      performImproveDesc: '本次优化实施后，预计本SQL的性能将提升',
      beforePlan: '执行计划(优化前)',
      afterPlan: '执行计划(优化后)'
    }
  }
};
