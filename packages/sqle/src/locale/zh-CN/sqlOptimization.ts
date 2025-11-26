// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL调优',
  ceTips:
    '当您需要获得SQL重写建议、优化SQL执行性能时，可以使用平台提供的智能调优功能，同时获取SQL改写、索引优化、性能验证等多重优化结果',
  noConfiagurationTips:
    'SQL调优功能可以帮助您自动优化SQL性能。该功能为付费增值模块，请联系商务获取详细信息。',
  table: {
    optimizationId: 'ID',
    numberOfRule: '触发调优规则总数',
    numberOfIndexx: '索引总数',
    optimizationName: '名称',
    instanceName: '数据源',
    dbType: '数据库类型',
    performanceGain: '优化提升性能',
    createTime: '创建时间',
    status: '状态',
    creator: '创建人',
    autoRefresh: '自动刷新',
    openAutoRefreshTips: '开启自动刷新（每5秒刷新一次）',
    closeAutoRefreshTips: '关闭自动刷新（当前每5秒刷新一次）',
    view: '查看'
  },
  status: {
    finish: '调优成功',
    failed: '调优失败',
    optimizing: '调优进行中'
  },
  create: {
    linkButton: '创建智能调优',
    returnButton: '返回SQL调优列表',
    successTips: '创建SQL调优成功',
    base: {
      title: '创建SQL调优',
      name: 'SQL调优名称'
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
        '目前，支持 SQL 美化的数据库类型有 {{supportType}}。如果未选择数据源或选择的数据源类型尚未得到支持，进行 SQL 美化可能会导致 SQL 语句语法错误。',
      enableHighAnalysis: '启用高精度索引推荐',
      enableHighAnalysisTips:
        '将统计SQL中列的区分度，可能会产生较大的数据库性能开销',
      form: {
        optimizationType: '调优类型',
        optimizationTypeDesc:
          '在线调优时，平台将根据所选数据源的实际库表结构给出建议；离线调优时，平台将不会连接数据源。',
        onlineOptimization: '在线调优',
        offlineOptimization: '离线调优',
        sql: 'SQL语句',
        executionPlan: '执行计划',
        executionPlanPlaceholder: '请输入执行计划（可选）',
        tableStructure: '表结构',
        tableStructurePlaceholder: '请输入表结构（可选）'
      },
      uploadTypeEnum: {
        sql: '输入SQL语句',
        sqlFile: '上传SQL文件',
        mybatisFile: '上传Mybatis的XML文件',
        zipFile: '上传ZIP文件',
        git: '配置GIT仓库'
      },
      uploadLabelEnum: {
        sql: 'SQL语句',
        sqlFile: 'SQL文件',
        mybatisFile: 'Mybatis的XML文件',
        zipFile: 'ZIP文件',
        gitUrl: 'GIT地址'
      },
      uploadFileTip: {
        sqlFile: '点击选择SQL文件或将文件拖拽到此区域',
        mybatisFile: '点击选择Mybatis的XML文件或将文件拖拽到此区域',
        zipFile:
          '点击选择ZIP文件或将文件拖拽到此区域，当前仅支持对ZIP文件中的.xml文件及.sql文件做SQL审核'
      }
    },
    resultTips: '优化进行中，预计5-10分钟后完成。感谢您的耐心等待。',
    simpleSqlTips: '当前仅支持对单条SQL进行调优',
    resetForm: '重置表单'
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
  },
  result: {
    viewOptimizationResult: '返回SQL调优列表',
    newOptimizedQuery: '新的优化查询为',
    originalQuery: '原始的SQL查询为',
    bestPerformanceSqlTips:
      '当前 SQL 已经达到最优性能，系统未进行任何修改，以下展示原始SQL！',
    indexOptimizationAdvice: '索引优化建议',
    indexOptimizationAdviceTips:
      '在执行上述最终优化的SQL前，请先创建下面这些索引',
    indexOriginalAdviceTips: '在执行原始SQL前，请先创建下面这些索引',
    optimizedExecutionPlan: '优化后的执行计划',
    viewDifference: '查看差异',
    viewTableStructure: '查看表结构',
    expand: '展开',
    performanceImprovement: '性能提升',
    automaticOptimization: '自动优化',
    whichOptimizationRulesUsed: '使用了哪些优化规则？',
    clickToViewRuleEffect: '点击查看每个规则对 SQL 语句的影响',
    compareSqlDifferences: '比较 SQL 优化前后的差异',
    viewTableStructureAndOptimalIndex: '查看表结构及最佳索引',
    viewOptimizationResults: '查看优化结果',
    compareExecutionPlanDifferences: '比较执行计划优化前后的差异',
    tableStructureForQuery: '该查询的表结构',
    optimalIndexForQuery: '该查询的最佳索引',
    details: '详情',
    beforeOptimization: '优化前',
    afterOptimization: '优化后',
    original: '原文',
    finalOptimized: '最终优化后',
    originalExecutionPlan: '原执行计划',
    exitFullscreen: '退出全屏',
    fullscreenDisplay: '全屏显示',
    drawerTitle: 'SQL调优结果详情',
    optimizing: '优化进行中',
    bestIndexUsedForOriginalSql:
      '恭喜，您的原始SQL已使用了最佳索引，暂无进一步的优化！',
    bestIndexUsedForOptimizedSql:
      '恭喜，您的上述最终优化的SQL已使用了最佳索引，暂无进一步的优化！',
    cannotOptimizeByIndexTips:
      '注意！您的SQL暂无法通过索引解决性能问题，可参考如下方式调整：',
    sqlQueryAlreadyOptimal:
      '恭喜！ 您的SQL查询配置已经非常优秀，无需进一步优化。'
  }
};
